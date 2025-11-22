import { Link } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const NavBar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => logout()

    return (
        <header className="bg-gradient-to-b from-ocean-mid to-ocean-light border-b-4 border-ocean-deep">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/">
                    <h1 className="text-2xl font-bold text-sand-light">Dive Logger</h1>
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sand-light font-medium">Hi, {user.email}!</span>

                            <Link
                                to="/log-dive"
                                className="px-3 py-1 rounded-md bg-ocean-mid text-sand-light hover:bg-ocean-deep transition-all"
                            >
                                Log Dive
                            </Link>
                            <button
                                onClick={handleClick}
                                className="px-3 py-1 rounded-md bg-coral text-sand-light hover:bg-[#ff5c49] transition-all"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-3 py-1 rounded-md bg-ocean-mid text-sand-light hover:bg-ocean-deep transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-3 py-1 rounded-md bg-ocean-mid text-sand-light hover:bg-ocean-deep transition-all"
                            >
                                Signup
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default NavBar
