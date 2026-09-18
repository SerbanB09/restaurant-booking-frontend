import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { listStaffVenues, createVenue, deleteVenue, type StaffVenue } from '../../api/staffData';

function ManageVenuesPage() {
    const { staffToken } = useStaffAuth();
    const [venues, setVenues] = useState<StaffVenue[]>([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function load() {
        if (!staffToken) return;
        listStaffVenues(staffToken).then(setVenues).catch((err) => setError(err.message));
    }

    useEffect(load, [staffToken]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!staffToken) return;
        setSubmitting(true);
        setError(null);
        try {
            await createVenue({ name, address }, staffToken);
            setName('');
            setAddress('');
            load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!staffToken) return;
        if (!confirm('Delete this venue? This cannot be undone.')) return;
        try {
            await deleteVenue(id, staffToken);
            load();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="font-display text-2xl">Venues</h2>

            <div className="mt-6 space-y-3">
                {venues.map((v) => (
                    <div key={v.id} className="border border-sage p-4 flex items-center justify-between">
                        <div>
                            <Link to={`/staff/manage/venues/${v.id}`} className="font-sans font-medium text-forest hover:underline">{v.name}</Link>
                            <p className="font-sans text-sm text-ink/60">{v.address}</p>
                        </div>
                        <button onClick={() => handleDelete(v.id)} className="font-sans text-sm text-wine hover:underline">Delete</button>
                    </div>
                ))}
                {venues.length === 0 && <p className="font-sans text-ink/50">No venues yet.</p>}
            </div>

            <form onSubmit={handleCreate} className="mt-8 border-t border-sage pt-6 space-y-4">
                <h3 className="font-display text-lg">Add a venue</h3>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                {error && <p className="font-sans text-sm text-wine">{error}</p>}
                <button type="submit" disabled={submitting} className="bg-brass text-forest-dark px-5 py-2 font-sans font-medium disabled:opacity-40">
                    {submitting ? 'Adding...' : 'Add venue'}
                </button>
            </form>
        </div>
    );
}

export default ManageVenuesPage;