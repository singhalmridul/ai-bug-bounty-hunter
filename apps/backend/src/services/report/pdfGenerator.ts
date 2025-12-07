import PDFDocument from 'pdfkit';
import fs from 'fs';

export class ReportService {
    async generateScanReport(scanId: string, findings: any[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            // Branding / Header
            doc.fontSize(24).font('Helvetica-Bold').text('AI Bug Bounty Hunter', { align: 'center' });
            doc.fontSize(10).font('Helvetica').text('Automated Vulnerability Assessment Report', { align: 'center' });
            doc.moveDown(2);

            // Scan Info
            doc.rect(50, 150, 510, 80).fill('#f9fafb').stroke('#e5e7eb');
            doc.fillColor('black');

            doc.fontSize(12).font('Helvetica-Bold').text('Scan ID:', 70, 170);
            doc.font('Helvetica').text(scanId, 150, 170);

            doc.font('Helvetica-Bold').text('Date:', 70, 190);
            doc.font('Helvetica').text(new Date().toLocaleString(), 150, 190);

            doc.font('Helvetica-Bold').text('Total Findings:', 70, 210);
            doc.font('Helvetica').text(findings.length.toString(), 150, 210);

            doc.moveDown(4);

            // Executive Summary
            doc.fontSize(18).font('Helvetica-Bold').text('Executive Summary');
            doc.moveTo(50, doc.y + 10).lineTo(560, doc.y + 10).stroke();
            doc.moveDown(1.5);

            if (findings.length === 0) {
                doc.fontSize(12).font('Helvetica').text('No vulnerabilities were detected during this scan. Great job!');
            } else {
                const criticals = findings.filter(f => f.severity === 'CRITICAL').length;
                const highs = findings.filter(f => f.severity === 'HIGH').length;
                doc.fontSize(12).font('Helvetica').text(`This scan identified ${findings.length} issues, including ${criticals} Critical and ${highs} High severity vulnerabilities.`);
            }

            doc.moveDown(2);

            // Detailed Findings
            if (findings.length > 0) {
                doc.addPage();
                doc.fontSize(18).font('Helvetica-Bold').text('Detailed Findings');
                doc.moveDown(1);

                findings.forEach((finding, index) => {
                    const y = doc.y;

                    // Severity Badge Color
                    const color = finding.severity === 'CRITICAL' ? 'red' :
                        finding.severity === 'HIGH' ? 'orange' : 'grey';

                    doc.rect(50, y, 5, 20).fill(color);
                    doc.fillColor('black');

                    doc.fontSize(14).font('Helvetica-Bold').text(finding.title || finding.type || 'Untitled Issue', 65, y);
                    doc.fontSize(10).font('Helvetica').text(finding.severity, 480, y, { align: 'right' });

                    doc.moveDown(0.5);
                    doc.fontSize(10).font('Helvetica-Bold').text('URL:');
                    doc.font('Helvetica').text(finding.url, { width: 480 });

                    doc.moveDown(0.5);
                    doc.fontSize(10).font('Helvetica-Bold').text('Description:');
                    doc.font('Helvetica').text(finding.description, { width: 480 });

                    doc.moveDown(2);
                });
            }

            // Footer
            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).text(
                    `Page ${i + 1} of ${range.count}`,
                    50,
                    doc.page.height - 50,
                    { align: 'center', width: doc.page.width - 100 }
                );
            }

            doc.end();
        });
    }
}
