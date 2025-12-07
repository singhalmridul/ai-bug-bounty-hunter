import PDFDocument from 'pdfkit';
import fs from 'fs';

export class ReportService {
    async generateScanReport(scanId: string, findings: any[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            // Report Header
            doc.fontSize(25).text('Security Scan Report', 100, 50);
            doc.fontSize(12).text(`Scan ID: ${scanId}`, 100, 80);
            doc.text(`Date: ${new Date().toISOString()}`, 100, 95);

            doc.moveDown();
            doc.fontSize(18).text('Executive Summary');
            doc.fontSize(12).text(`Total Findings: ${findings.length}`);

            doc.moveDown();
            doc.fontSize(18).text('Detailed Findings');

            // Findings Loop
            findings.forEach((finding, index) => {
                doc.moveDown();
                doc.fontSize(14).text(`${index + 1}. ${finding.title || 'Untitled Issue'}`);
                doc.fontSize(12).text(`Severity: ${finding.severity || 'Unknown'}`);
                doc.text(`URL: ${finding.url}`);
                doc.text(`Description: ${finding.description || 'No description provided.'}`);
                doc.moveDown(0.5);
            });

            doc.end();
        });
    }
}
