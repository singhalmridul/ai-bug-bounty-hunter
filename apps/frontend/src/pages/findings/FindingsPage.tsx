import { useState } from 'react';
import { Download, AlertTriangle, Shield } from 'lucide-react';

const FindingsPage = () => {
    // Mock data for UI development
    const [findings] = useState([
        { id: 1, title: 'Reflected XSS on Search', severity: 'High', status: 'Open', timestamp: '2 mins ago' },
        { id: 2, title: 'SQL Injection in ID Parameter', severity: 'Critical', status: 'Open', timestamp: '5 mins ago' },
        { id: 3, title: 'Open Port 22 Found', severity: 'Medium', status: 'Fixed', timestamp: '1 hour ago' },
    ]);

    const handleDownloadReport = async (scanId: string) => {
        // Pseudo-logic: In real app, fetch from backend blob
        window.open(`http://localhost:3000/scans/${scanId}/report`);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security Findings</h1>
                    <p className="text-muted-foreground mt-1">Real-time vulnerability detection results.</p>
                </div>
                <button
                    onClick={() => handleDownloadReport('123')}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            <div className="grid gap-4">
                {findings.map((finding) => (
                    <div key={finding.id} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${finding.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                finding.severity === 'High' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{finding.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Shield size={12} /> {finding.severity}
                                    </span>
                                    <span>•</span>
                                    <span>{finding.timestamp}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${finding.status === 'Fixed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                {finding.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindingsPage;
