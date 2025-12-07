import { chromium, Browser, Page } from 'playwright';
import { runQuery } from '../db/neo4j';
import { PromptManager } from '@bugbounty/shared';
import { ScanConfig } from '@bugbounty/shared';
import pino from 'pino';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// OpenAI initialized lazily

const logger = pino({ level: 'info' });

export class CrawlerEngine {
    private browser: Browser | null = null;

    async init() {
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async processUrl(config: ScanConfig, scanId: string) {
        if (!this.browser) await this.init();

        const page = await this.browser!.newPage();
        try {
            logger.info(`Crawling ${config.url} for Scan ${scanId}`);

            // Navigate
            await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            const title = await page.title();
            const content = await page.content();

            // Extract Links
            const links = await page.$$eval('a', (anchors) =>
                anchors.map(a => a.href).filter(href => href.startsWith('http'))
            );

            // Limited by Max Pages/Depth (Basic check for now)
            if (links.length > config.maxPages) {
                links.length = config.maxPages;
            }

            // Save to Neo4j
            await this.saveToGraph(config.url, title, links, scanId);

            // AI Analysis
            if (config.templates && config.templates.length > 0) {
                for (const templateType of config.templates) {
                    const template = PromptManager.getTemplate(templateType);
                    const filledPrompt = PromptManager.fillTemplate(template.userTemplate, {
                        url: config.url,
                        context: content.substring(0, 2000) // Increased context
                    });

                    logger.info(`[AI ANALYSIS] Generated Prompt for ${templateType} on ${config.url}`);

                    try {
                        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                        const completion = await openai.chat.completions.create({
                            model: 'gpt-4-1106-preview',
                            messages: [
                                { role: 'system', content: template.system },
                                { role: 'user', content: filledPrompt }
                            ],
                            response_format: { type: 'json_object' }
                        });

                        const result = completion.choices[0]?.message?.content;
                        if (result) {
                            const params = JSON.parse(result);
                            logger.info({ params }, `[AI DISCOVERY] Findings for ${templateType}`);

                            // Save Finding
                            if (params.payload || params.pattern) {
                                await this.saveFinding(scanId, config.url, templateType, params);
                            }
                        }
                    } catch (err) {
                        logger.error({ err }, `AI Analysis failed for ${templateType}`);
                    }
                }
            }

            return { status: 'success', title, linksCount: links.length };

        } catch (err) {
            logger.error(`Error crawling ${config.url}: ${err}`);
            throw err;
        } finally {
            await page.close();
        }
    }

    private async saveToGraph(url: string, title: string, links: string[], scanId: string) {
        // Create Page Node
        const query = `
      MERGE (p:Page {url: $url})
      SET p.title = $title, p.lastScanned = datetime()
      
      MERGE (s:Scan {id: $scanId})
      MERGE (s)-[:SCANNED]->(p)
      
      WITH p
      UNWIND $links as link
      MERGE (l:Page {url: link})
      MERGE (p)-[:LINKS_TO]->(l)
    `;

        await runQuery(query, { url, title, links, scanId });
    }

    private async saveFinding(scanId: string, url: string, type: string, data: any) {
        const findingId = uuidv4();
        const severity = data.severity || 'HIGH'; // Default to HIGH if not AI specified
        const description = data.description || JSON.stringify(data);

        const query = `
            MATCH (p:Page {url: $url})
            MATCH (s:Scan {id: $scanId})
            MERGE (f:Finding {id: $id})
            SET f.type = $type, 
                f.severity = $severity, 
                f.description = $description, 
                f.data = $dataStr,
                f.createdAt = datetime()
            
            MERGE (p)-[:HAS_FINDING]->(f)
            MERGE (s)-[:FOUND]->(f)
        `;

        await runQuery(query, {
            id: findingId,
            url,
            scanId,
            type,
            severity,
            description,
            dataStr: JSON.stringify(data)
        });

        logger.info(`Saved finding ${findingId} to Neo4j`);
    }
}
