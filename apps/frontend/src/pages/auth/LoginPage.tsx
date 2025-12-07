import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegistering ? 'http://localhost:3000/auth/register' : 'http://localhost:3000/auth/login';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8 border rounded-xl bg-card">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{isRegistering ? 'Create an account' : 'Welcome back'}</h2>
                    <p className="mt-2 text-muted-foreground">
                        {isRegistering ? 'Enter your details to get started' : 'Sign in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    {isRegistering && (
                        <div>
                            <label className="text-sm font-medium">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 p-2 border rounded-md bg-background"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full mt-1 p-2 border rounded-md bg-background"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full mt-1 p-2 border rounded-md bg-background"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                    >
                        {isRegistering ? 'Sign up' : 'Sign in'}
                    </button>
                </form>

                <div className="flex flex-col space-y-4">
                    <div className="text-center text-sm">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-primary hover:underline"
                        >
                            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
