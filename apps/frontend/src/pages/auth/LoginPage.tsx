import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // For MVP, we'll hit a dev login endpoint that gives us a token for a default user
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'demo@bugbounty.ai' })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                alert('Login failed. Ensure backend is running.');
            }
        } catch (error) {
            console.error(error);
            alert('Login error. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-lg shadow-lg">
                <div className="flex flex-col items-center space-y-2">
                    <Shield className="h-12 w-12 text-primary" />
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your Bug Bounty Dashboard</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Continue with SSO (Demo)'}
                    </button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <button className="w-full py-2 px-4 border rounded-md hover:bg-muted font-medium opacity-50 cursor-not-allowed">
                        GitHub (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
