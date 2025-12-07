import React from 'react';
import NewScanDialog from '../../components/NewScanDialog';

const ScansPage: React.FC = () => {
    const [scans, setScans] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const fetchScans = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/scans', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        fetchScans();
        const interval = setInterval(fetchScans, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8">
            <NewScanDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onScanStarted={fetchScans}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Scans</h2>
                    <p className="text-muted-foreground">Manage and monitor your security scans.</p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                    New Scan
                </button>
            </div>

            <div className="border rounded-md">
                {loading ? (
                    <div className="p-4 text-center">Loading...</div>
                ) : scans.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No scans running currently.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">Target</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scans.map((scan) => (
                                <tr key={scan.id} className="border-t">
                                    <td className="p-4 font-mono text-sm">{scan.id.substring(0, 8)}...</td>
                                    <td className="p-4">{scan.targetUrl}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${scan.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                scan.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {scan.status}
                                            </span>
                                            {scan.status === 'PENDING' || scan.status === 'RUNNING' ? (
                                                <button
                                                    onClick={async () => {
                                                        const token = localStorage.getItem('token');
                                                        await fetch(`http://localhost:3000/scans/${scan.id}/stop`, {
                                                            method: 'PATCH',
                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                        });
                                                        fetchScans();
                                                    }}
                                                    className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
                                                >
                                                    Stop
                                                </button>
                                            ) : scan.status === 'COMPLETED' ? (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const res = await fetch(`http://localhost:3000/scans/${scan.id}/report`, {
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            });
                                                            if (res.ok) {
                                                                const blob = await res.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.href = url;
                                                                a.download = `scan-${scan.id}.pdf`;
                                                                a.click();
                                                            }
                                                        } catch (err) {
                                                            console.error(err);
                                                        }
                                                    }}
                                                    className="px-2 py-1 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50"
                                                >
                                                    Download Report
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(scan.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="text-xs text-muted-foreground text-center">
                Auto-refreshing every 3s ⚡
            </div>
        </div>
    );
};

export default ScansPage;
