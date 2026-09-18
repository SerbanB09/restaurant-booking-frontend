import { Link, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';

function StaffLayout() {
    const { staffUser, staffLogout } = useStaffAuth();
    const isAdmin = staffUser?.roles.includes('admin');

    return (
        <div className="min-h-screen bg-ivory">
            <div className="bg-forest text-ivory px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-6">
                    <Link to="/staff" className="font-display text-xl">Staff dashboard</Link>
                    <nav className="font-sans text-sm flex items-center gap-4">
                        <Link to="/staff" className="text-sage hover:text-ivory">Floor plan</Link>
                        <Link to="/staff/manage/venues" className="text-sage hover:text-ivory">Venues</Link>
                        <Link to="/staff/manage/table-types" className="text-sage hover:text-ivory">Table types</Link>
                        {isAdmin && <Link to="/staff/manage/staff" className="text-sage hover:text-ivory">Staff</Link>}
                    </nav>
                </div>
                <div className="font-sans text-sm flex items-center gap-4">
                    <span className="text-sage">
                        {staffUser?.first_name} {staffUser?.last_name}
                        {isAdmin ? ' (admin)' : ''}
                    </span>
                    <button onClick={staffLogout} className="underline text-ivory/70 hover:text-ivory">Log out</button>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default StaffLayout;