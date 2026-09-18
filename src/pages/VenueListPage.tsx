import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listVenues, type VenueSummary } from '../api/public';

function VenueListPage() {
    const [venues, setVenues] = useState<VenueSummary[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listVenues()
            .then(setVenues)
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p className="font-sans text-wine p-10">{error}</p>;
    }

    if (!venues) {
        return <p className="font-sans text-ink/50 p-10">Loading...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="font-display text-4xl">Find a table</h1>
            <p className="font-sans text-ink/70 mt-2">Choose a restaurant to book.</p>

            <div className="mt-8 space-y-3">
                {venues.length === 0 && (
                    <p className="font-sans text-ink/50">No restaurants yet. Check back soon.</p>
                )}
                {venues.map((venue) => (
                    <Link
                        key={venue.id}
                        to={`/venues/${venue.id}`}
                        className="block border border-sage p-5 hover:border-brass transition-colors"
                    >
                        <h2 className="font-display text-xl">{venue.name}</h2>
                        <p className="font-sans text-sm text-ink/60 mt-1">{venue.address}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VenueListPage;