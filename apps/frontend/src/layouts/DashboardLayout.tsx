import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, Bug, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">BugHunter AI</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink to="/scans" icon={<Activity size={20} />} label="Active Scans" />
                    <NavLink to="/findings" icon={<Bug size={20} />} label="Findings" />
                    <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-border/50">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                            <span className="font-medium text-xs">JD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">John Doe</p>
                            <p className="text-xs text-muted-foreground truncate">john@acme.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/95">
                <Outlet />
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
