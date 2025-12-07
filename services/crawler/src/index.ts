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

const crawlerWorker = new Worker('crawler-queue', async (job: any) => {
    logger.info(`Starting crawl job ${job.id}`);
    const { scanId, config, url } = job.data;

    // Support both new config-based jobs and legacy url-based jobs
    const effectiveConfig = config || {
        url: url,
        maxDepth: 2,
        maxPages: 10,
        templates: []
    };

    return crawlerEngine.processUrl(effectiveConfig, scanId);
}, { connection });

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
