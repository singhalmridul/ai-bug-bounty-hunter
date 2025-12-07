import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, Bug, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-foreground font-sans overflow-hidden selection:bg-primary/20">
            {/* Sidebar with Glassmorphism */}
            <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldAlert className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-xl tracking-tight text-white block">BugHunter</span>
                            <span className="text-xs text-muted-foreground font-medium bg-white/5 px-2 py-0.5 rounded-full">AI Edition</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">Platform</div>
                    <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" />
                    <NavLink to="/scans" icon={<Activity size={18} />} label="Active Scans" />
                    <NavLink to="/findings" icon={<Bug size={18} />} label="Findings" />

                    <div className="pt-4 px-3 py-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">Configuration</div>
                    <NavLink to="/settings" icon={<Settings size={18} />} label="Settings" />
                </nav>

                <div className="mt-auto p-4 space-y-2">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-white/5 hover:text-primary"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group relative">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-bold shadow-lg">
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate opacity-70">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content with Gradient Background */}
            <main className="flex-1 relative overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />

                <div className="h-full w-full overflow-auto relative z-10 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-primary/5 hover:text-primary active:scale-95",
                "text-muted-foreground hover:translate-x-1"
            )}
        >
            {icon}
            {label}
        </Link>
    );
}
