import type { GuestBooking, Venue } from '../api/public';

interface Props {
    booking: GuestBooking;
    venue: Venue;
    onBookAnother: () => void;
}

function ConfirmationTicket({ booking, venue, onBookAnother }: Props) {
    const date = new Date(booking.date);

    return (
        <div className="border border-forest p-8">
            <h2 className="font-display text-3xl">You're all set.</h2>
            <p className="font-sans text-ink/70 mt-1">{venue.name}</p>
            <div className="mt-6 space-y-2 font-sans text-ink">
                <p>{booking.guest_name}, party of {booking.person_count}</p>
                <p>
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
            </div>
            <button onClick={onBookAnother} className="mt-8 text-sm text-forest underline">
                Make another reservation
            </button>
        </div>
    );
}

export default ConfirmationTicket;