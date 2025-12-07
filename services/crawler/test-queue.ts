import { Queue, Worker } from 'bullmq';

const connection = {
    host: 'localhost',
    port: 6379
};

const queue = new Queue('crawler-queue', { connection });

async function main() {
    const counts = await queue.getJobCounts();
    console.log('Current Job Counts:', counts);

    console.log('Adding test job...');
    const job = await queue.add('crawl-job', {
        scanId: 'test-scan-manual-script',
        config: {
            url: 'http://example.com'
        }
    });
    console.log(`Job ${job.id} added successfully`);

    console.log('Starting local worker to verify consumption...');
    const worker = new Worker('crawler-queue', async (j) => {
        console.log(`[LOCAL WORKER] Processing job ${j.id}`);
        return { status: 'done' };
    }, { connection });

    worker.on('active', (j) => console.log(`Worker active on ${j.id}`));
    worker.on('completed', (j) => console.log(`Worker completed ${j.id}`));
    worker.on('failed', (j, err) => console.log(`Worker failed ${j?.id}: ${err}`));

    // Keep alive for 10s
    await new Promise(resolve => setTimeout(resolve, 10000));
    await worker.close();
    process.exit(0);
}

main().catch(console.error);
