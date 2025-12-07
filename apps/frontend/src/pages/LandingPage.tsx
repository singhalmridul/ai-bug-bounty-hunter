import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Search, Lock } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="border-b border-white/10 backdrop-blur-sm fixed w-full z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <Shield className="w-6 h-6 text-blue-500" />
                        <span>BugBounty<span className="text-blue-500">AI</span></span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        v2.0 Now Available with AI Exploit Generation
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Automate Offensive Security <br />
                        <span className="text-blue-500">with Intelligence.</span>
                    </h1>

                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop relying on manual pentesting. Our autonomous AI agents crawl, identify, and verify vulnerabilities in real-time, delivering actionable Proof-of-Concepts (PoCs) instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <Zap className="w-4 h-4" />
                            Start Scanning
                        </button>
                        <button className="h-12 px-8 rounded-full border border-zinc-700 hover:bg-zinc-900 text-zinc-300 font-medium transition-colors">
                            View Documentation
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 py-24 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Search className="w-8 h-8 text-blue-400" />}
                        title="Deep Crawling"
                        description="Playwright-powered engine discovers hidden endpoints and DOM states invisible to traditional scanners."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-purple-400" />}
                        title="AI Payload Generation"
                        description="LLM-driven payload creation tailored to specific tech stacks and context windows."
                    />
                    <FeatureCard
                        icon={<Lock className="w-8 h-8 text-green-400" />}
                        title="Verified PoCs"
                        description="Zero false positives. Every finding is backed by a reproduced exploit chain."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
        <div className="mb-4 p-3 rounded-xl bg-black w-fit group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-100">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
