import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const { customer, logout } = useAuth();

    return (
        <nav className="bg-forest text-ivory px-6 py-4 flex items-center justify-between">
            <Link to="/" className="font-display text-xl">TableTime</Link>
            <div className="font-sans text-sm flex items-center gap-4">
                {customer ? (
                    <>
                        <Link to="/account" className="text-sage hover:text-ivory">Hi, {customer.first_name}</Link>
                        <button onClick={logout} className="text-ivory/70 hover:text-ivory underline">Log out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-brass">Log in</Link>
                        <Link to="/register" className="hover:text-brass">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;