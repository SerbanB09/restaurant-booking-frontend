import type { FloorPlanTable } from '../api/staffData';

interface Props {
    table: FloorPlanTable;
    onClose: () => void;
}

function BookingDetailPanel({ table, onClose }: Props) {
    const booking = table.booking;
    if (!booking) return null;

    const date = new Date(booking.date);

    return (
        <div className="border border-forest p-6 w-full max-w-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Table {table.name}</h3>
                <button onClick={onClose} className="font-sans text-sm text-ink/50 hover:text-ink">Close</button>
            </div>

            <div className="mt-4 space-y-2 font-sans text-sm text-ink">
                <p>{booking.guest_name ?? 'No name on file (staff booking)'}</p>
                {booking.guest_phone && <p className="text-ink/70">{booking.guest_phone}</p>}
                <p>Party of {booking.person_count}</p>
                <p>
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
                {booking.note && <p className="text-ink/60 italic">"{booking.note}"</p>}
            </div>
        </div>
    );
}

export default BookingDetailPanel;