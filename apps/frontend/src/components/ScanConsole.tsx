import React from 'react';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';

interface ScanConsoleProps {
    isOpen: boolean;
    onClose: () => void;
    scanId: string;
    targetUrl: string;
}

const ScanConsole: React.FC<ScanConsoleProps> = ({ isOpen, onClose, scanId, targetUrl }) => {
    const [logs, setLogs] = React.useState<string[]>([]);
    const [isMaximized, setIsMaximized] = React.useState(false);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    // Mock Log Streaming for now
    React.useEffect(() => {
        if (!isOpen) return;
        setLogs([`[INFO] Initializing scan for ${targetUrl}...`, `[INFO] Scan ID: ${scanId}`]);

        const interval = setInterval(() => {
            const newLog = `[INFO] ${new Date().toISOString()} - Crawling ${targetUrl}/page-${Math.floor(Math.random() * 10)}`;
            setLogs(prev => [...prev, newLog]);
            // Auto-scroll
            if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 2000);

        return () => clearInterval(interval);
    }, [isOpen, scanId, targetUrl]);

    if (!isOpen) return null;

    return (
        <div className={`fixed z-50 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col font-mono text-sm
            ${isMaximized ? 'inset-4 rounded-xl' : 'bottom-4 right-4 w-[600px] h-[400px] rounded-xl'}
            bg-[#0c0c0c] border border-white/10 ring-1 ring-white/5`}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 select-none">
                <div className="flex items-center gap-2 text-white/70">
                    <Terminal size={14} />
                    <span className="font-semibold">Console Output - {scanId.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="p-1 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors"
                    >
                        {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-500/20 rounded-md text-white/50 hover:text-red-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-auto p-4 space-y-1 bg-black/50 custom-scrollbar">
                {logs.length === 0 && <span className="text-white/30 italic">Waiting for logs...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="text-white/80 break-all font-mono">
                        <span className="text-blue-400">{log.split(' ')[0]}</span>{' '}
                        <span className="text-green-400">{log.split(' ').slice(1, 2)}</span>{' '}
                        <span>{log.split(' ').slice(2).join(' ')}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ScanConsole;
