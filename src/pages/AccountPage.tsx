import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as customersApi from '../api/customers';

function AccountPage() {
    const { customer, token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token) return;
        setSubmitting(true);
        setError(null);
        setMessage(null);
        try {
            await customersApi.changePassword(token, {
                current_password: currentPassword,
                new_password: newPassword
            });
            setMessage('Password updated.');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!customer) {
        return <p className="font-sans text-ink/50 p-10">You need to log in to view this page.</p>;
    }

    return (
        <div className="max-w-sm mx-auto px-6 py-16">
            <h1 className="font-display text-3xl">My account</h1>
            <p className="font-sans text-ink/70 mt-2">{customer.first_name} {customer.last_name}</p>
            <p className="font-sans text-ink/50 text-sm">{customer.email}</p>

            <h2 className="font-display text-xl mt-10">Change password</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-2">Current password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="border border-sage px-3 py-2 font-sans w-full"
                    />
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-2">New password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border border-sage px-3 py-2 font-sans w-full"
                    />
                </div>

                {message && <p className="font-sans text-sm text-forest">{message}</p>}
                {error && <p className="font-sans text-sm text-wine">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40"
                >
                    {submitting ? 'Updating...' : 'Update password'}
                </button>
            </form>
        </div>
    );
}

export default AccountPage;