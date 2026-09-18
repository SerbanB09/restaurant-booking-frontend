import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

function StaffLoginPage() {
    const { staffLoginAction } = useStaffAuth();
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
            await staffLoginAction(email, password);
            navigate('/staff');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-forest flex items-center justify-center px-6">
            <div className="max-w-sm w-full">
                <h1 className="font-display text-3xl text-ivory">Staff login</h1>
                <p className="font-sans text-sage text-sm mt-1">For restaurant staff only.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="font-sans text-sm text-sage block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                        />
                    </div>
                    <div>
                        <label className="font-sans text-sm text-sage block mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                        />
                    </div>

                    {error && <p className="font-sans text-sm text-red-300">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40"
                    >
                        {submitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
                <p className="font-sans text-sm text-sage mt-6">
                    New restaurant? <Link to="/staff/register" className="text-ivory underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default StaffLoginPage;