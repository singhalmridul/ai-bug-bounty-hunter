import React from 'react';
import { Save, Key, Shield, Bell } from 'lucide-react';

const SettingsPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage organization preferences and API keys.</p>
            </div>

            {/* API Keys Section */}
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <Key size={20} className="text-primary" /> API Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Configure external services for your scans.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">OpenAI API Key</label>
                        <input
                            type="password"
                            defaultValue="sk-........................"
                            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono"
                        />
                        <p className="text-xs text-muted-foreground">Used for AI-driven vulnerability analysis.</p>
                    </div>
                </div>
                <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:brightness-110">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <Bell size={20} className="text-primary" /> Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage how you get alerted.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-foreground">Email Alerts</div>
                            <div className="text-xs text-muted-foreground">Receive emails when critical bugs are found.</div>
                        </div>
                        <div className="h-6 w-11 bg-primary/20 rounded-full relative cursor-pointer">
                            <div className="h-4 w-4 bg-primary rounded-full absolute top-1 right-1 shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
