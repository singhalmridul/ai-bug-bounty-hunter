import React from 'react';
import { Activity, ShieldAlert, FileText, Globe, RefreshCw, Clock, PauseCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage: React.FC = () => {
    const { token } = useAuth();
    const [stats, setStats] = React.useState({
        activeScans: 0,
        criticalFindings: 0,
        attackSurfaceAssets: 0,
        vulnScore: '-'
    });
    const [loading, setLoading] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(new Date());

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (token) {
            fetchStats();
            const interval = setInterval(fetchStats, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [token]);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your attack surface and security posture.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground hidden md:inline-block">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm shadow-lg shadow-primary/20 transition-all">
                        <Activity size={16} />
                        New Scan
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Active Scans"
                    value={stats.activeScans}
                    icon={<Activity className="text-blue-400" />}
                    trend="+2 today"
                    gradient="from-blue-500/10 to-blue-600/5"
                    borderColor="border-blue-500/20"
                />
                <MetricCard
                    title="Critical Findings"
                    value={stats.criticalFindings}
                    icon={<ShieldAlert className="text-red-400" />}
                    trend="Requires attention"
                    trendColor="text-red-400"
                    gradient="from-red-500/10 to-red-600/5"
                    borderColor="border-red-500/20"
                />
                <MetricCard
                    title="Attack Surface"
                    value={stats.attackSurfaceAssets}
                    label="Assets"
                    icon={<Globe className="text-emerald-400" />}
                    trend="Stable"
                    gradient="from-emerald-500/10 to-emerald-600/5"
                    borderColor="border-emerald-500/20"
                />
                <MetricCard
                    title="Vuln Score"
                    value={stats.vulnScore}
                    icon={<FileText className="text-purple-400" />}
                    subtext="Security Rating"
                    gradient="from-purple-500/10 to-purple-600/5"
                    borderColor="border-purple-500/20"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Scans - Takes up 2 columns */}
                <div className="lg:col-span-2 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-white">Recent Activity</h3>
                            <p className="text-sm text-muted-foreground">Latest scans and their status.</p>
                        </div>
                    </div>
                    <div className="p-0">
                        <RecentScansTable token={token} />
                    </div>
                </div>

                {/* System Status / Estimations */}
                <div className="space-y-6">
                    <EstimationCard activeScans={stats.activeScans} />
                </div>
            </div>
        </div>
    );
};

// ... Subcomponents ...

const MetricCard = ({ title, value, label, icon, trend, trendColor = "text-muted-foreground", subtext, gradient, borderColor }: any) => (
    <div className={`p-6 rounded-xl border ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-md relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
            {icon}
        </div>
        <div className="relative z-10">
            <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
            <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
                {value}
                {label && <span className="text-base font-normal text-muted-foreground">{label}</span>}
            </div>
            {(trend || subtext) && (
                <div className={`text-xs mt-2 ${trendColor} font-medium flex items-center gap-1`}>
                    {trend || subtext}
                </div>
            )}
        </div>
    </div>
);

const EstimationCard = ({ activeScans }: { activeScans: number }) => {
    // Mock logic for estimation display
    if (activeScans === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Clock size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">System Idle</h4>
                        <p className="text-xs text-muted-foreground">No active scans.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-blue-500/20 bg-blue-900/10 backdrop-blur-md p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                    <Activity size={20} className="text-blue-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-white">Processing Scans</h4>
                    <p className="text-xs text-blue-300">Crawler & AI Engine Active</p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Estimated Completion</span>
                        <span className="text-white font-medium">~4 mins</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%] rounded-full animate-progress-indeterminate"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-muted-foreground">PDF Generation</span>
                    <span className="text-amber-400 font-medium">Pending</span>
                </div>
            </div>
        </div>
    );
}

const RecentScansTable = ({ token }: { token: string | null }) => {
    const [scans, setScans] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    const fetchScans = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/scans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setScans(data.slice(0, 5));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    React.useEffect(() => {
        fetchScans();
        const interval = setInterval(fetchScans, 5000);
        return () => clearInterval(interval);
    }, [fetchScans]);

    if (scans.length === 0 && !loading) {
        return <div className="p-8 text-center text-muted-foreground text-sm">No recent scans found. Start one to see it here.</div>;
    }

    return (
        <div className="relative">
            {loading && scans.length === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <RefreshCw className="animate-spin text-white" />
                </div>
            )}

            <table className="w-full text-sm text-left">
                <thead className="text-muted-foreground font-medium bg-white/5">
                    <tr>
                        <th className="px-6 py-3">Target</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Started</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{scan.targetUrl}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={scan.status} />
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{new Date(scan.createdAt).toLocaleTimeString()}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-xs text-primary hover:underline font-medium">View Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'COMPLETED') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={12} /> Completed</span>;
    if (status === 'FAILED') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertTriangle size={12} /> Failed</span>;
    if (status === 'RUNNING') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><RefreshCw size={12} className="animate-spin" /> Running</span>;
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20"><Clock size={12} /> {status}</span>;
}

export default DashboardPage;
