import { Queue } from 'bullmq';
import { redis } from '../config/db';

const crawlerQueue = new Queue('crawler-queue', {
    connection: redis,
});

import { ScanConfig } from '@bugbounty/shared';

export const addCrawlJob = async (config: ScanConfig, scanId: string) => {
    await crawlerQueue.add('crawl-job', {
        config,
        scanId,
        url: config.url,
    });
};

const exploitQueue = new Queue('exploit-queue', {
    connection: redis,
});

export const addExploitJob = async (url: string, payload: string, attackType: string, scanId: string) => {
    await exploitQueue.add('exploit-job', {
        url,
        payload,
        attackType,
        scanId,
    });
};
