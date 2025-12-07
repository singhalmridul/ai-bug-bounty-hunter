import React from 'react';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = React.useState({
        activeScans: 0,
        criticalFindings: 0,
        attackSurfaceAssets: 0,
        vulnScore: '-'
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your attack surface and recent findings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Active Scans", value: stats.activeScans },
                    { title: "Critical Findings", value: stats.criticalFindings },
                    { title: "Attack Surface", value: `${stats.attackSurfaceAssets} Assets` },
                    { title: "Vuln Score", value: stats.vulnScore }
                ].map((item, i) => (
                    <div key={i} className="p-6 border rounded-xl bg-card">
                        <div className="text-sm font-medium text-muted-foreground">{item.title}</div>
                        <div className="text-2xl font-bold mt-2">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4">
                <div className="border rounded-xl bg-card">
                    <div className="p-6 pb-2">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Scans</h3>
                        <p className="text-sm text-muted-foreground">Latest scanning activity.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <RecentScansTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mini component for Recent Scans
const RecentScansTable = () => {
    const [scans, setScans] = React.useState<any[]>([]);

    const fetchScans = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/scans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setScans(data.slice(0, 5)); // Limit to 5
            }
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        fetchScans();
        const interval = setInterval(fetchScans, 5000);
        return () => clearInterval(interval);
    }, []);

    if (scans.length === 0) return <div className="text-sm text-muted-foreground">No recent scans.</div>;

    return (
        <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground font-medium">
                <tr>
                    <th className="pb-2">Target</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Time</th>
                </tr>
            </thead>
            <tbody>
                {scans.map((scan) => (
                    <tr key={scan.id} className="border-t">
                        <td className="py-2">{scan.targetUrl}</td>
                        <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${scan.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                scan.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {scan.status}
                            </span>
                        </td>
                        <td className="py-2 text-muted-foreground">{new Date(scan.createdAt).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DashboardPage;
