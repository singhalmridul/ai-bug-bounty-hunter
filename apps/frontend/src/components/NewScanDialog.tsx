import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface NewScanDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onScanStarted: () => void;
}

const NewScanDialog: React.FC<NewScanDialogProps> = ({ isOpen, onClose, onScanStarted }) => {
    const [url, setUrl] = useState('');
    const [maxDepth, setMaxDepth] = useState(2);
    const [maxPages, setMaxPages] = useState(10);
    const [templates, setTemplates] = useState<string[]>(['XSS', 'SQLi']);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scanId = uuidv4();
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/scans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    url,
                    scanId,
                    templates,
                    maxDepth,
                    maxPages,
                    attackType: 'custom' // Legacy field
                })
            });

            if (res.ok) {
                onScanStarted();
                onClose();
                setUrl('');
            } else {
                alert('Failed to start scan');
            }
        } catch (error) {
            console.error(error);
            alert('Error starting scan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-background border p-6 rounded-lg shadow-lg w-full max-w-md bg-zinc-950 text-zinc-100">
                <h2 className="text-xl font-bold mb-4">Start New Scan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Target URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com"
                            className="w-full p-2 rounded border bg-zinc-900 border-zinc-800 focus:ring-2 ring-blue-500 outline-none"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Scan Templates (AI Prompts)</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-zinc-800 rounded bg-zinc-900">
                            {['XSS', 'SQLi', 'SensitiveData'].map((t) => (
                                <label key={t} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={templates.includes(t)}
                                        onChange={(e) => {
                                            if (e.target.checked) setTemplates([...templates, t]);
                                            else setTemplates(templates.filter(x => x !== t));
                                        }}
                                        className="rounded border-zinc-700 bg-zinc-800"
                                    />
                                    <span>{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Depth ({maxDepth})</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                className="w-full"
                                value={maxDepth}
                                onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Pages ({maxPages})</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className="w-full p-2 rounded border bg-zinc-900 border-zinc-800"
                                value={maxPages}
                                onChange={(e) => setMaxPages(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded hover:bg-zinc-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Starting...' : 'Start Scan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewScanDialog;
