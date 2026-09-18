import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto px-6 py-16">
            <h1 className="font-display text-3xl">Log in</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-sage px-3 py-2 font-sans w-full"
                    />
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-sage px-3 py-2 font-sans w-full"
                    />
                </div>

                {error && <p className="font-sans text-sm text-wine">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40"
                >
                    {submitting ? 'Logging in...' : 'Log in'}
                </button>
            </form>

            <p className="font-sans text-sm text-ink/60 mt-6">
                No account yet? <Link to="/register" className="text-forest underline">Sign up</Link>
            </p>
        </div>
    );
}

export default LoginPage;