import dotenv from 'dotenv';
dotenv.config();

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { SharedConstants } from '@bugbounty/shared';
import { prisma, neo4jDriver, redis } from './config/db';
import { addCrawlJob } from './services/queue';

const server: FastifyInstance = Fastify({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
        },
    },
});

server.register(cors, {
    origin: '*', // Lock this down in production
});
import jwt from '@fastify/jwt';
import { authMiddleware } from './middleware/auth';
import { tenantMiddleware } from './middleware/tenant';
// Types are loaded via tsconfig

server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
});
server.register(authMiddleware);
server.register(tenantMiddleware);

server.register(sensible);

// Auth Routes (Public)
server.post('/auth/login', async (request, reply) => {
    // Mock login for MVP
    // In production, verify credentials/SSO token here
    const { email } = request.body as { email: string } || { email: 'demo@bugbounty.ai' };

    // Create or get user (Mock logic)
    const userPayload = {
        id: 'user-ss-1',
        email,
        organizationId: 'org-demo-1',
        role: 'ADMIN'
    };

    const token = server.jwt.sign(userPayload);
    return { token };
});



// Verify DB Connections
server.after(async () => {
    try {
        await prisma.$connect();
        server.log.info('Postgres Connected');

        await neo4jDriver.verifyConnectivity();
        server.log.info('Neo4j Connected');

        if (redis.status === 'ready' || redis.status === 'connect') {
            server.log.info('Redis Connected');
        }
    } catch (err: unknown) {
        server.log.error('Failed to connect to databases');
        server.log.error(err);
    }
});

server.get('/health', async (request, reply) => {
    return { status: 'ok', app: SharedConstants.APP_NAME };
});

server.register(async (instance) => {
    instance.post('/scans', {
        onRequest: [instance.authenticate]
    }, async (request, reply) => {
        const { url, scanId, attackType = 'all', maxDepth = 2, maxPages = 10, templates = [] } = request.body as {
            url: string,
            scanId: string,
            attackType?: string,
            maxDepth?: number,
            maxPages?: number,
            templates?: string[]
        };

        if (!url || !scanId) {
            return reply.code(400).send({ error: 'url and scanId are required' });
        }

        try {
            // Persist scan configuration
            await prisma.scan.create({
                data: {
                    id: scanId,
                    targetUrl: url,
                    organizationId: (request.user as any).organizationId,
                    status: 'PENDING',
                    attackType,
                    maxDepth
                }
            });

            // Construct ScanConfig
            const config = {
                url,
                maxDepth,
                maxPages,
                templates: templates.length > 0 ? templates : (attackType === 'all' ? ['XSS', 'SQLi', 'SensitiveData'] : [attackType])
            };

            await addCrawlJob(config, scanId);

            instance.log.info(`Dispatched crawl job for ${url} with type ${attackType}`);
            return { status: 'queued', scanId };
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Failed to start scan' });
        }
    });

    instance.get('/scans', {
        onRequest: [instance.authenticate]
    }, async (request, reply) => {
        // In a real app, filters by tenantId from request.user
        try {
            const scans = await prisma.scan.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10
            });
            return scans;
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Failed to fetch scans' });
        }
    });

    instance.get('/dashboard/stats', {
        onRequest: [instance.authenticate]
    }, async (request, reply) => {
        try {
            // Active Scans
            const activeScansCount = await prisma.scan.count({
                where: { status: { in: ['PENDING', 'RUNNING'] } }
            });

            // Stats from Neo4j (Mocking for speed if Neo4j query is complex or empty)
            // Real query: MATCH (n:Page) RETURN count(n) as assets
            // Real query: MATCH (f:Finding {severity: 'CRITICAL'}) RETURN count(f) as criticals

            // For MVP, we'll try to get real counts if possible, else mock
            let assetsCount = 0;
            let criticalsCount = 0;

            const session = neo4jDriver.session();
            try {
                const assetsRes = await session.run('MATCH (n:Page) RETURN count(n) as count');
                if (assetsRes.records.length > 0) {
                    assetsCount = assetsRes.records[0].get('count').toNumber();
                }

                // Assuming we stored Findings as nodes
                const findingsRes = await session.run("MATCH (f:Finding {severity: 'CRITICAL'}) RETURN count(f) as count");
                if (findingsRes.records.length > 0) {
                    criticalsCount = findingsRes.records[0].get('count').toNumber();
                }
            } catch (neoErr) {
                instance.log.warn({ err: neoErr }, 'Neo4j stats failed, using defaults');
            } finally {
                await session.close();
            }

            return {
                activeScans: activeScansCount,
                criticalFindings: criticalsCount,
                attackSurfaceAssets: assetsCount,
                vulnScore: criticalsCount > 5 ? 'D' : criticalsCount > 0 ? 'C' : 'A'
            };

        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Failed to fetch dashboard stats' });
        }
    });

    instance.patch('/scans/:id/stop', {
        onRequest: [instance.authenticate]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            await prisma.scan.update({
                where: { id },
                data: { status: 'FAILED' } // Using FAILED to indicate stopped/cancelled for MVP
            });
            // In a real app we'd also signal the crawler queue/worker to abort
            return { status: 'stopped' };
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Failed to stop scan' });
        }
    });

    instance.get('/scans/:id/report', {
        onRequest: [instance.authenticate]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        // Mock findings data for now
        const mockFindings = [
            { title: 'Reflected XSS', severity: 'High', url: 'http://example.com?q=<script>', description: 'Input reflected in DOM' },
            { title: 'SQL Injection', severity: 'Critical', url: 'http://example.com/api', description: 'Blind SQLi in id param' }
        ];

        try {
            // Need to import ReportService, for now mock response
            // const buffer = await reportService.generateScanReport(id, mockFindings);
            // reply.header('Content-Type', 'application/pdf');
            // reply.header('Content-Disposition', `attachment; filename="scan-${id}.pdf"`);
            // return reply.send(buffer);
            return { status: 'Report generation temporarily disabled for refactor' };
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Failed to generate report' });
        }
    });
});


// Report route moved inside register block

const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
