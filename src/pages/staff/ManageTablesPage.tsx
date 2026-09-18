import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import {
    listTables, createTable, deleteTable, listTableTypes, listStaffAreas,
    type StaffTable, type StaffTableType, type StaffArea
} from '../../api/staffData';

function ManageTablesPage() {
    const { areaId } = useParams<{ areaId: string }>();
    const { staffToken } = useStaffAuth();

    const [area, setArea] = useState<StaffArea | null>(null);
    const [tables, setTables] = useState<StaffTable[]>([]);
    const [tableTypes, setTableTypes] = useState<StaffTableType[]>([]);

    const [name, setName] = useState('');
    const [seatCount, setSeatCount] = useState(4);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [tableTypeId, setTableTypeId] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function load() {
        if (!staffToken || !areaId) return;
        listStaffAreas(staffToken).then((all) => setArea(all.find((a) => a.id === areaId) ?? null));
        listTables(staffToken).then((all) => setTables(all.filter((t) => t.area_id === areaId))).catch((err) => setError(err.message));
        listTableTypes(staffToken).then((types) => {
            setTableTypes(types);
            if (types.length > 0) setTableTypeId((current) => current || types[0].id);
        });
    }

    useEffect(load, [staffToken, areaId]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!staffToken || !areaId || !tableTypeId) return;
        setSubmitting(true);
        setError(null);
        try {
            await createTable({ area_id: areaId, table_type_id: tableTypeId, name, seat_count: seatCount, position_x: positionX, position_y: positionY }, staffToken);
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
        if (!confirm('Delete this table? This cannot be undone.')) return;
        try {
            await deleteTable(id, staffToken);
            load();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    if (tableTypes.length === 0 && !error) {
        return (
            <div className="p-6 max-w-2xl">
                <Link to="/staff/manage/venues" className="font-sans text-sm text-forest hover:underline">&larr; All venues</Link>
                <p className="font-sans text-ink/60 mt-4">
                    You need at least one table type before adding tables.{' '}
                    <Link to="/staff/manage/table-types" className="text-forest underline">Add one here.</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl">
            <Link to="/staff/manage/venues" className="font-sans text-sm text-forest hover:underline">&larr; All venues</Link>
            <h2 className="font-display text-2xl mt-2">{area?.name ?? 'Tables'}</h2>
            <p className="font-sans text-sm text-ink/50">Area size: {area?.width} × {area?.height}</p>

            <div className="mt-6 space-y-3">
                {tables.map((t) => (
                    <div key={t.id} className="border border-sage p-4 flex items-center justify-between">
                        <div>
                            <p className="font-sans font-medium">{t.name}</p>
                            <p className="font-sans text-sm text-ink/60">{t.seat_count} seats · position ({t.position_x}, {t.position_y})</p>
                        </div>
                        <button onClick={() => handleDelete(t.id)} className="font-sans text-sm text-wine hover:underline">Delete</button>
                    </div>
                ))}
                {tables.length === 0 && <p className="font-sans text-ink/50">No tables yet.</p>}
            </div>

            <form onSubmit={handleCreate} className="mt-8 border-t border-sage pt-6 space-y-4">
                <h3 className="font-display text-lg">Add a table</h3>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required className="border border-sage px-3 py-2 font-sans w-full" />
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Table type</label>
                    <select value={tableTypeId} onChange={(e) => setTableTypeId(e.target.value)} className="border border-sage px-3 py-2 font-sans w-full">
                        {tableTypes.map((tt) => <option key={tt.id} value={tt.id}>{tt.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Seats</label>
                        <input type="number" value={seatCount} onChange={(e) => setSeatCount(Number(e.target.value))} required min={1} className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Position X</label>
                        <input type="number" value={positionX} onChange={(e) => setPositionX(Number(e.target.value))} required min={0} className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                    <div className="flex-1">
                        <label className="font-sans text-sm text-ink/70 block mb-1">Position Y</label>
                        <input type="number" value={positionY} onChange={(e) => setPositionY(Number(e.target.value))} required min={0} className="border border-sage px-3 py-2 font-sans w-full" />
                    </div>
                </div>
                <p className="font-sans text-xs text-ink/50">Position is in pixels from the top-left of the floor plan (area is {area?.width} × {area?.height}).</p>
                {error && <p className="font-sans text-sm text-wine">{error}</p>}
                <button type="submit" disabled={submitting} className="bg-brass text-forest-dark px-5 py-2 font-sans font-medium disabled:opacity-40">
                    {submitting ? 'Adding...' : 'Add table'}
                </button>
            </form>
        </div>
    );
}

export default ManageTablesPage;