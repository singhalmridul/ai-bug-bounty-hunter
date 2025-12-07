import * as dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import { initNeo4j } from './db/neo4j';
import { CrawlerEngine } from './engine/crawler';
import { ExploitExecutor } from './engine/executor';
import pino from 'pino';

const logger = pino({ level: 'info' });

// Init Neo4j
initNeo4j();

const crawlerEngine = new CrawlerEngine();
const exploitExecutor = new ExploitExecutor();

// Redis connection
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
};
console.log('[DEBUG] Connecting to Redis...', connection);

const crawlerWorker = new Worker('crawler-queue', async (job: any) => {
    console.log(`[WORKER] Received job ${job.id}`);
    const { scanId, config, url } = job.data;

    // Check cancellation signal from Redis
    const Redis = require('ioredis');
    const redisClient = new Redis(connection);

    const stopKey = `scan:stop:${scanId}`;
    const shouldStop = await redisClient.get(stopKey);
    redisClient.disconnect();

    if (shouldStop) {
        console.log(`Scan ${scanId} was cancelled by user. Aborting job.`);
        return { status: 'cancelled' };
    }

    // Support both new config-based jobs and legacy url-based jobs
    const effectiveConfig = config || {
        url: url,
        maxDepth: 2,
        maxPages: 10,
        templates: []
    };

    return crawlerEngine.processUrl(effectiveConfig, scanId);
}, { connection });

crawlerWorker.on('ready', () => {
    console.log('[WORKER] Worker is ready and connected to Redis');
});

crawlerWorker.on('error', (err) => {
    console.error('[WORKER] Worker error', err);
});

crawlerWorker.on('active', (job) => {
    console.log(`[WORKER] Job ${job.id} is now active!`);
});

crawlerWorker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} failed:`, err);
});

const exploitWorker = new Worker('exploit-queue', async (job: any) => {
    logger.info(`Starting exploit job ${job.id}`);
    const { url, payload, attackType } = job.data;
    return exploitExecutor.executePayload(url, payload, attackType);
}, { connection });

// Handle shutdown
process.on('SIGTERM', async () => {
    await crawlerWorker.close();
    await exploitWorker.close();
    await crawlerEngine.close();
    await exploitExecutor.close();
});

logger.info('Crawler Service Started');
