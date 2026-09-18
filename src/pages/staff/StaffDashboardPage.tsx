import { useEffect, useState } from 'react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import {
    listStaffVenues, listStaffAreas, getFloorPlan,
    type StaffVenue, type StaffArea, type FloorPlan, type FloorPlanTable
} from '../../api/staffData';
import FloorPlanCanvas from '../../components/FloorPlanCanvas';
import BookingDetailPanel from '../../components/BookingDetailPanel';

function nowForInput() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

function StaffDashboardPage() {
    const { staffToken } = useStaffAuth();

    const [venues, setVenues] = useState<StaffVenue[]>([]);
    const [areas, setAreas] = useState<StaffArea[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [selectedAreaId, setSelectedAreaId] = useState<string>('');
    const [dateTime, setDateTime] = useState(nowForInput());

    const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
    const [selectedTable, setSelectedTable] = useState<FloorPlanTable | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!staffToken) return;
        Promise.all([listStaffVenues(staffToken), listStaffAreas(staffToken)])
            .then(([venuesRes, areasRes]) => {
                setVenues(venuesRes);
                setAreas(areasRes);
                if (venuesRes.length > 0) setSelectedVenueId(venuesRes[0].id);
            })
            .catch((err) => setError(err.message));
    }, [staffToken]);

    const areasForVenue = areas.filter((a) => a.venue_id === selectedVenueId);

    useEffect(() => {
        if (areasForVenue.length > 0 && !areasForVenue.some(a => a.id === selectedAreaId)) {
            setSelectedAreaId(areasForVenue[0].id);
        }
    }, [selectedVenueId, areas]);

    useEffect(() => {
        if (!staffToken || !selectedAreaId) return;
        const isoDate = new Date(dateTime).toISOString();
        getFloorPlan(selectedAreaId, isoDate, staffToken)
            .then(setFloorPlan)
            .catch((err) => setError(err.message));
    }, [selectedAreaId, dateTime, staffToken]);

    if (venues.length === 0) {
        return (
            <div className="p-10">
                <p className="font-sans text-ink/60">No venues yet. Add one under "Venues" to get started.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="p-6 flex flex-wrap gap-4 items-end border-b border-sage">
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Venue</label>
                    <select value={selectedVenueId} onChange={(e) => setSelectedVenueId(e.target.value)} className="border border-sage px-3 py-2 font-sans">
                        {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Area</label>
                    <select value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)} className="border border-sage px-3 py-2 font-sans">
                        {areasForVenue.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="font-sans text-sm text-ink/70 block mb-1">Viewing time</label>
                    <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="border border-sage px-3 py-2 font-sans" />
                </div>
                <div className="font-sans text-sm text-ink/60 flex items-center gap-4 ml-auto">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 bg-available inline-block" /> Available</span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 bg-wine inline-block" /> Booked</span>
                </div>
            </div>

            {error && <p className="font-sans text-wine p-6">{error}</p>}

            {areasForVenue.length === 0 ? (
                <p className="font-sans text-ink/60 p-6">This venue has no areas yet. Add one under "Venues".</p>
            ) : (
                <div className="p-6 flex gap-6 items-start flex-wrap">
                    {floorPlan && <FloorPlanCanvas floorPlan={floorPlan} onSelectTable={setSelectedTable} />}
                    {selectedTable && <BookingDetailPanel table={selectedTable} onClose={() => setSelectedTable(null)} />}
                </div>
            )}
        </div>
    );
}

export default StaffDashboardPage;