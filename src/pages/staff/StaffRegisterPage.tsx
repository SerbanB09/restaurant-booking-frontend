import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

function StaffRegisterPage() {
    const { staffRegisterAction } = useStaffAuth();
    const navigate = useNavigate();

    const [restaurantName, setRestaurantName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await staffRegisterAction({
                restaurant_name: restaurantName,
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });
            navigate('/staff');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-forest flex items-center justify-center px-6 py-16">
            <div className="max-w-sm w-full">
                <h1 className="font-display text-3xl text-ivory">Register your restaurant</h1>
                <p className="font-sans text-sage text-sm mt-1">You'll be the first admin.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="font-sans text-sm text-sage block mb-2">Restaurant name</label>
                        <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            required
                            className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="font-sans text-sm text-sage block mb-2">First name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-sans text-sm text-sage block mb-2">Last name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                            />
                        </div>
                    </div>
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
                            minLength={6}
                            className="border border-sage bg-ivory px-3 py-2 font-sans w-full"
                        />
                    </div>

                    {error && <p className="font-sans text-sm text-red-300">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40"
                    >
                        {submitting ? 'Creating...' : 'Create restaurant account'}
                    </button>
                </form>

                <p className="font-sans text-sm text-sage mt-6">
                    Already registered? <Link to="/staff/login" className="text-ivory underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default StaffRegisterPage;