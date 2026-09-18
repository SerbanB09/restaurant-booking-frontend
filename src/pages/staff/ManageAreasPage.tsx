import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { listStaffAreas, createArea, deleteArea, listStaffVenues, type StaffArea, type StaffVenue } from '../../api/staffData';

function ManageAreasPage() {
    const { venueId } = useParams<{ venueId: string }>();
    const { staffToken } = useStaffAuth();

    const [venue, setVenue] = useState<StaffVenue | null>(null);
    const [areas, setAreas] = useState<StaffArea[]>([]);
    const [name, setName] = useState('');
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(400);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function load() {
        if (!staffToken || !venueId) return;
        listStaffVenues(staffToken).then((venues) => setVenue(venues.find((v) => v.id === venueId) ?? null));
        listStaffAreas(staffToken).then((all) => setAreas(all.filter((a) => a.venue_id === venueId))).catch((err) => setError(err.message));
    }

    useEffect(load, [staffToken, venueId]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!staffToken || !venueId) return;
        setSubmitting(true);
        setError(null);
        try {
            await createArea({ venue_id: venueId, name, width, height }, staffToken);
            setName('');
            load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!staffToken) return;
        if (!confirm('Delete this area? This cannot be undone.')) return;
        try {
            await deleteArea(id, staffToken);
            load();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="p-6 max-w-2xl">
            <Link to="/staff/manage/venues" className="font-sans text-sm text-forest hover:underline">&larr; All venues</Link>
            <h2 className="font-display text-2xl mt-2">{venue?.name ?? 'Areas'}</h2>

            <div className="mt-6 space-y-3">
                {areas.map((a) => (
                    <div key={a.id} className="border border-sage p-4 flex items-center justify-between">
                        <div>
                            <Link to={`/staff/manage/areas/${a.id}`} className="font-sans font-medium text-forest hover:underline">{a.name}</Link>
                            <p className="font-sans text-sm text-ink/60">{a.width} × {a.height}</p>
                        </div>
                        <button onClick={() => handleDelete(a.id)} className="font-sans text-sm text-wine hover:underline">Delete</button>
                    </div>
                ))}
                {areas.length === 0 && <p className="font-sans text-ink/50">No areas yet.</p>}
            </div>

            <form onSubmit={handleCreate} className="mt-8 border-t border-sage pt-6 space-y-4">
                <h3 className="font-display text-lg">Add an area</h3>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Width</label>
                        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} required min={1} className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Height</label>
                        <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} required min={1} className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                </div>
                {error && <p className="font-sans text-sm text-wine">{error}</p>}
                <button type="submit" disabled={submitting} className="bg-brass text-forest-dark px-5 py-2 font-sans font-medium disabled:opacity-40">
                    {submitting ? 'Adding...' : 'Add area'}
                </button>
            </form>
        </div>
    );
}

export default ManageAreasPage;