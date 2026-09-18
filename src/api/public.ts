const API_URL = import.meta.env.VITE_API_URL;

export interface Venue {
    id: string;
    name: string;
    address: string;
}

export interface GuestBookingPayload {
    guest_name: string;
    guest_phone: string;
    person_count: number;
    date: string;
}

export interface GuestBooking {
    id: string;
    venue_id: string;
    person_count: number;
    date: string;
    guest_name: string;
}

export async function getVenue(venueId: string): Promise<Venue> {
    const res = await fetch(`${API_URL}/public/venues/${venueId}`);
    if (!res.ok) {
        throw new Error('Could not load this venue.');
    }
    return res.json();
}

export async function createGuestBooking(venueId: string, payload: GuestBookingPayload): Promise<GuestBooking> {
    const res = await fetch(`${API_URL}/public/venues/${venueId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.status === 409) {
        throw new Error('No tables are available at that time. Try a different time or date.');
    }

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Something went wrong. Please try again.');
    }

    return res.json();
}