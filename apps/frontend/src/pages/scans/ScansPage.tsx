import React, { useState } from 'react';
import NewScanDialog from '../../components/NewScanDialog';
import ScanConsole from '../../components/ScanConsole';
import { Play, Square, FileText, Terminal, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ScansPage: React.FC = () => {
    const { token } = useAuth();
    const [scans, setScans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Console State
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [activeScanId, setActiveScanId] = useState<string | null>(null);
    const [activeTarget, setActiveTarget] = useState<string>("");

    const fetchScans = async () => {
        try {
            const res = await fetch('http://localhost:3000/scans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setScans(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (token) {
            fetchScans();
            const interval = setInterval(fetchScans, 3000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const handleStop = async (id: string) => {
        await fetch(`http://localhost:3000/scans/${id}/stop`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchScans();
    };

    const handleDownload = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/scans/${id}/report`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `scan-${id}.pdf`;
                a.click();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openConsole = (id: string, target: string) => {
        setActiveScanId(id);
        setActiveTarget(target);
        setConsoleOpen(true);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <NewScanDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onScanStarted={fetchScans}
            />

            {activeScanId && (
                <ScanConsole
                    isOpen={consoleOpen}
                    onClose={() => setConsoleOpen(false)}
                    scanId={activeScanId}
                    targetUrl={activeTarget}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Scans</h2>
                    <p className="text-muted-foreground mt-1">Manage and monitor your security scans.</p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/25"
                >
                    <Play size={16} />
                    New Scan
                </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-muted-foreground animate-pulse">Loading scans...</div>
                ) : scans.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Play size={32} className="opacity-50" />
                        </div>
                        <p>No scans found. Start your first bug hunt!</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-muted-foreground font-medium uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Target</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Started</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {scans.map((scan) => (
                                <tr key={scan.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{scan.targetUrl}</div>
                                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{scan.id.substring(0, 8)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={scan.status} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(scan.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {/* Console Button */}
                                            <button
                                                onClick={() => openConsole(scan.id, scan.targetUrl)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                                title="View Console"
                                            >
                                                <Terminal size={16} />
                                            </button>

                                            {/* Stop Button */}
                                            {(scan.status === 'PENDING' || scan.status === 'RUNNING') && (
                                                <button
                                                    onClick={() => handleStop(scan.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-medium"
                                                >
                                                    <Square size={12} fill="currentColor" /> Stop
                                                </button>
                                            )}

                                            {/* Report Button */}
                                            {scan.status === 'COMPLETED' && (
                                                <button
                                                    onClick={() => handleDownload(scan.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium"
                                                >
                                                    <FileText size={14} /> Report
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'COMPLETED':
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={12} /> Completed</span>;
        case 'FAILED':
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle size={12} /> Failed</span>;
        case 'RUNNING':
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock size={12} className="animate-spin" /> Running</span>;
        default:
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10"><Clock size={12} /> {status}</span>;
    }
};

export default ScansPage;
