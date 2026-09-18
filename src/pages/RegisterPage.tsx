import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await register({ first_name: firstName, last_name: lastName, email, phone, password });
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto px-6 py-16">
            <h1 className="font-display text-3xl">Create an account</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-2">First name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="border border-sage px-3 py-2 font-sans w-full"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-2">Last name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="border border-sage px-3 py-2 font-sans w-full"
                        />
                    </div>
                </div>
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
                    <label className="font-sans text-sm text-ink/70 block mb-2">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                        minLength={6}
                        className="border border-sage px-3 py-2 font-sans w-full"
                    />
                </div>

                {error && <p className="font-sans text-sm text-wine">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40"
                >
                    {submitting ? 'Creating account...' : 'Sign up'}
                </button>
            </form>

            <p className="font-sans text-sm text-ink/60 mt-6">
                Already have an account? <Link to="/login" className="text-forest underline">Log in</Link>
            </p>
        </div>
    );
}

export default RegisterPage;