import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVenue, createBooking, type Venue, type Booking } from '../api/public';
import { useAuth } from '../context/AuthContext';
import PartySizeStepper from '../components/PartySizeStepper';
import TimeSlotPicker from '../components/TimeSlotPicker';
import ConfirmationTicket from '../components/ConfirmationTicket';

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function VenueDetailPage() {
    const { venueId } = useParams<{ venueId: string }>();
    const { customer, token } = useAuth();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [venueError, setVenueError] = useState<string | null>(null);

    const [partySize, setPartySize] = useState(2);
    const [date, setDate] = useState(todayISO());
    const [time, setTime] = useState<string | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (!venueId) return;
        getVenue(venueId)
            .then(setVenue)
            .catch((err) => setVenueError(err.message));
    }, [venueId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!time || !venueId) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const isoDate = new Date(`${date}T${time}:00`).toISOString();
            const result = await createBooking(
                venueId,
                {
                    person_count: partySize,
                    date: isoDate,
                    ...(customer ? {} : { guest_name: guestName, guest_phone: guestPhone })
                },
                token
            );
            setBooking(result);
        } catch (err) {
            setSubmitError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    function handleBookAnother() {
        setBooking(null);
        setTime(null);
        setGuestName('');
        setGuestPhone('');
        setSubmitError(null);
    }

    if (venueError) {
        return <p className="font-sans text-wine p-10">{venueError}</p>;
    }

    if (!venue) {
        return <p className="font-sans text-ink/50 p-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
            <div className="bg-forest text-ivory p-10 md:w-2/5 flex flex-col justify-center">
                <Link to="/" className="font-sans text-sm text-sage hover:text-ivory">&larr; All restaurants</Link>
                <h1 className="font-display text-4xl mt-4">{venue.name}</h1>
                <p className="font-sans mt-2 text-sage">{venue.address}</p>
                <p className="font-sans mt-6 text-ivory/70 text-sm max-w-xs">
                    Pick a party size and a time, and we'll seat you at the right table.
                </p>
            </div>

            <div className="p-10 md:w-3/5 flex items-center justify-center">
                {booking ? (
                    <ConfirmationTicket booking={booking} venue={venue} onBookAnother={handleBookAnother} />
                ) : (
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                        <h2 className="font-display text-2xl">Reserve a table</h2>

                        {customer && (
                            <p className="font-sans text-sm text-ink/60 bg-sage/40 px-3 py-2">
                                Booking as {customer.first_name} {customer.last_name}
                            </p>
                        )}

                        <div>
                            <label className="font-sans text-sm text-ink/70 block mb-2">Party size</label>
                            <PartySizeStepper value={partySize} onChange={setPartySize} />
                        </div>

                        <div>
                            <label className="font-sans text-sm text-ink/70 block mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                min={todayISO()}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="border border-sage px-3 py-2 font-sans w-full"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-sm text-ink/70 block mb-2">Time</label>
                            <TimeSlotPicker value={time} onChange={setTime} />
                        </div>

                        {!customer && (
                            <>
                                <div>
                                    <label className="font-sans text-sm text-ink/70 block mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        required
                                        className="border border-sage px-3 py-2 font-sans w-full"
                                    />
                                </div>
                                <div>
                                    <label className="font-sans text-sm text-ink/70 block mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                        required
                                        className="border border-sage px-3 py-2 font-sans w-full"
                                    />
                                </div>
                            </>
                        )}

                        {submitError && <p className="font-sans text-sm text-wine">{submitError}</p>}

                        <button
                            type="submit"
                            disabled={!time || submitting}
                            className="bg-brass text-forest-dark px-6 py-3 font-sans font-medium w-full disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Booking...' : 'Confirm reservation'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default VenueDetailPage;