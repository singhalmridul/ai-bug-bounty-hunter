import dotenv from 'dotenv';
dotenv.config();

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { SharedConstants } from '@bugbounty/shared';
import { prisma, neo4jDriver, redis } from './config/db';
import { addCrawlJob } from './services/queue';
import { ReportService } from './services/report/pdfGenerator';

const reportService = new ReportService();

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
// Auth Routes (Public)
import { AuthService } from './services/auth.service';
const authService = new AuthService();

server.post('/auth/register', async (request, reply) => {
    const { email, password, name } = request.body as any;
    if (!email || !password) return reply.code(400).send({ error: 'Missing credentials' });

    try {
        const user = await authService.register(email, password, name);
        const token = server.jwt.sign({
            id: user.id,
            email: user.email,
            organizationId: user.organizationId,
            role: user.role
        });
        return { token, user };
    } catch (err: any) {
        request.log.error(err);
        return reply.code(400).send({ error: err.message });
    }
});

server.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;

    const user = await authService.validateUser(email, password);
    if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = server.jwt.sign({
        id: user.id,
        email: user.email,
        organizationId: user.organizationId,
        role: user.role
    });

    return { token, user };
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

server.get('/', async (request, reply) => {
    return { message: 'AI Bug Bounty Hunter API is running', documentation: '/documentation' };
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
            // Signal Crawler to stop
            await redis.set(`scan:stop:${id}`, 'true', 'EX', 3600); // 1 hour TTL

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

        try {
            // Fetch findings from Neo4j
            const session = neo4jDriver.session();
            let findings: any[] = [];
            try {
                const res = await session.run(`
                    MATCH (s:Scan {id: $id})-[:FOUND]->(f:Finding)
                    RETURN f
                `, { id });

                findings = res.records.map(record => {
                    const f = record.get('f').properties;
                    return {
                        title: f.type || 'Vulnerability', // Fallback
                        severity: f.severity,
                        url: f.url, // Finding URL usually stored on the finding node itself or inferred
                        description: f.description
                    };
                });
            } finally {
                await session.close();
            }

            const buffer = await reportService.generateScanReport(id, findings);

            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', `attachment; filename="scan-${id}.pdf"`);
            return reply.send(buffer);

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
