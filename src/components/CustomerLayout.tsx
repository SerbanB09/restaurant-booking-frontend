import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

function CustomerLayout() {
    return (
        <div className="min-h-screen bg-ivory">
            <NavBar />
            <Outlet />
        </div>
    );
}

export default CustomerLayout;