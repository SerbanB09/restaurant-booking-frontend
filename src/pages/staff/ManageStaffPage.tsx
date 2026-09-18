import { useEffect, useState } from 'react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { listStaffUsers, createStaffUser, deleteStaffUser, type StaffAccountUser } from '../../api/staffData';

function ManageStaffPage() {
    const { staffToken, staffUser } = useStaffAuth();
    const [users, setUsers] = useState<StaffAccountUser[]>([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [makeAdmin, setMakeAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function load() {
        if (!staffToken) return;
        listStaffUsers(staffToken).then(setUsers).catch((err) => setError(err.message));
    }

    useEffect(load, [staffToken]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!staffToken) return;
        setSubmitting(true);
        setError(null);
        try {
            await createStaffUser({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                roles: makeAdmin ? ['admin', 'member'] : ['member']
            }, staffToken);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setMakeAdmin(false);
            load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!staffToken) return;
        if (!confirm('Remove this staff member?')) return;
        try {
            await deleteStaffUser(id, staffToken);
            load();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    if (!staffUser?.roles.includes('admin')) {
        return <p className="font-sans text-ink/60 p-6">Only admins can manage staff.</p>;
    }

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="font-display text-2xl">Staff</h2>

            <div className="mt-6 space-y-3">
                {users.map((u) => (
                    <div key={u.id} className="border border-sage p-4 flex items-center justify-between">
                        <div>
                            <p className="font-sans font-medium">
                                {u.first_name} {u.last_name}
                                {u.is_owner && <span className="ml-2 text-xs text-forest bg-sage/50 px-2 py-0.5">owner</span>}
                                {!u.is_owner && u.roles.includes('admin') && <span className="ml-2 text-xs text-brass-dark bg-sage/50 px-2 py-0.5">admin</span>}
                                {u.id === staffUser?.id && <span className="ml-2 text-xs text-ink/40">(you)</span>}
                            </p>
                            <p className="font-sans text-sm text-ink/60">{u.email}</p>
                        </div>
                        {u.id !== staffUser?.id && !u.is_owner && (
                            <button onClick={() => handleDelete(u.id)} className="font-sans text-sm text-wine hover:underline">Remove</button>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleCreate} className="mt-8 border-t border-sage pt-6 space-y-4">
                <h3 className="font-display text-lg">Add a staff member</h3>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">First name</label>
                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Last name</label>
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Temporary password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                <label className="font-sans text-sm flex items-center gap-2">
                    <input type="checkbox" checked={makeAdmin} onChange={(e) => setMakeAdmin(e.target.checked)} />
                    Make this person an admin
                </label>
                {error && <p className="font-sans text-sm text-wine">{error}</p>}
                <button type="submit" disabled={submitting} className="bg-brass text-forest-dark px-5 py-2 font-sans font-medium disabled:opacity-40">
                    {submitting ? 'Adding...' : 'Add staff member'}
                </button>
            </form>
        </div>
    );
}

export default ManageStaffPage;