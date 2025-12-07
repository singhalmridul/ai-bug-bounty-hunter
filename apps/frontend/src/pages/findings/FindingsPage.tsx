import { useState } from 'react';
import { Download, AlertTriangle, Shield, CheckCircle, Search, Globe } from 'lucide-react';

const FindingsPage = () => {
    // Mock data - would normally fetch from API
    const [findings] = useState([
        { id: 1, title: 'Reflected XSS on /search', severity: 'High', status: 'Open', timestamp: '2 mins ago', details: 'Input parameter "q" is not sanitized.', target: 'https://example-shop.com' },
        { id: 2, title: 'SQL Injection in /api/users', severity: 'Critical', status: 'Open', timestamp: '5 mins ago', details: 'ID parameter accepts numeric injection.', target: 'https://vulnerable-bank.com' },
        { id: 3, title: 'Open Port 22 (SSH)', severity: 'Medium', status: 'Fixed', timestamp: '1 hour ago', details: 'Standard port exposed to public internet.', target: 'https://admin-portal.org' },
        { id: 4, title: 'Missing Security Headers', severity: 'Low', status: 'Open', timestamp: '2 hours ago', details: 'HSTS and CSP headers missing.', target: 'https://blog-site.net' },
    ]);

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleFinding = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Findings</h1>
                    <p className="text-muted-foreground mt-1">Vulnerabilities detected across all scans.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground px-4 py-2 rounded-lg font-medium transition-colors">
                        <Search size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {findings.map((finding) => (
                    <div
                        key={finding.id}
                        onClick={() => toggleFinding(finding.id)}
                        className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:bg-white/5 transition-all cursor-pointer box-border group"
                    >
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-lg shrink-0 ${finding.severity === 'Critical' ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20' :
                                    finding.severity === 'High' ? 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20' :
                                        finding.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20' :
                                            'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20'
                                    }`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{finding.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{finding.details}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                        <span className="flex items-center gap-1 font-medium text-foreground">
                                            <Shield size={12} /> {finding.severity}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-primary/80">
                                            <Globe size={12} /> {finding.target}
                                        </span>
                                        <span>•</span>
                                        <span>{finding.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 ml-12 md:ml-0">
                                {finding.status === 'Fixed' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        <CheckCircle size={12} /> REMEDIATED
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                                        <AlertTriangle size={12} /> OPEN
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === finding.id && (
                            <div className="px-5 pb-5 pt-0 ml-16 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="h-px w-full bg-white/5 mb-4" />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-foreground">Description</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {finding.details} This vulnerability allows attackers to inject malicious code into web pages viewed by other users.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-foreground">Remediation</h4>
                                        <p className="text-sm text-emerald-400/80 leading-relaxed font-medium">
                                            Sanitize all user-supplied input using a library like DOMPurify before rendering it in the browser.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button className="text-xs text-primary hover:underline font-medium">
                                        View Full Execution Trace &rarr;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindingsPage;
