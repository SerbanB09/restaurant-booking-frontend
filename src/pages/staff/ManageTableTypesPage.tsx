import { useEffect, useState } from 'react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { listTableTypes, createTableType, deleteTableType, type StaffTableType } from '../../api/staffData';

function ManageTableTypesPage() {
    const { staffToken } = useStaffAuth();
    const [types, setTypes] = useState<StaffTableType[]>([]);
    const [name, setName] = useState('');
    const [width, setWidth] = useState(80);
    const [height, setHeight] = useState(80);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function load() {
        if (!staffToken) return;
        listTableTypes(staffToken).then(setTypes).catch((err) => setError(err.message));
    }

    useEffect(load, [staffToken]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!staffToken) return;
        setSubmitting(true);
        setError(null);
        try {
            await createTableType({ name, width, height }, staffToken);
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
        if (!confirm('Delete this table type? This cannot be undone.')) return;
        try {
            await deleteTableType(id, staffToken);
            load();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="font-display text-2xl">Table types</h2>
            <p className="font-sans text-sm text-ink/60 mt-1">
                A table type describes the physical size of a table (e.g. a standard 4-top). Used when adding tables to an area.
            </p>

            <div className="mt-6 space-y-3">
                {types.map((t) => (
                    <div key={t.id} className="border border-sage p-4 flex items-center justify-between">
                        <div>
                            <p className="font-sans font-medium">{t.name}</p>
                            <p className="font-sans text-sm text-ink/60">{t.width} × {t.height}</p>
                        </div>
                        <button onClick={() => handleDelete(t.id)} className="font-sans text-sm text-wine hover:underline">Delete</button>
                    </div>
                ))}
                {types.length === 0 && <p className="font-sans text-ink/50">No table types yet.</p>}
            </div>

            <form onSubmit={handleCreate} className="mt-8 border-t border-sage pt-6 space-y-4">
                <h3 className="font-display text-lg">Add a table type</h3>
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
                    {submitting ? 'Adding...' : 'Add table type'}
                </button>
            </form>
        </div>
    );
}

export default ManageTableTypesPage;