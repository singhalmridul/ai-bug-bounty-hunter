import React from 'react';

const SettingsPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage organization preferences and API keys.</p>
            </div>
        </div>
    );
};

export default SettingsPage;
