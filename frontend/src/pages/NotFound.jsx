import { Link } from "react-router-dom";
import macchi from "../assets/macchi.png";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-6">
            <div className="w-[200px] h-[200px] rounded-xl overflow-hidden flex items-center justify-center">
                <img
                    src={macchi}
                    alt="Cute dog"
                    className="w-full h-full object-cover"
                />
            </div>

            <h1 className="text-4xl font-bold text-ocean-deep mb-2 py-6">
                404 — Page Not Found
            </h1>

            <p className="text-gray-700 mb-6">
                Uh oh, we couldn’t fetch that page.
            </p>

            <Link
                to="/"
                className="px-4 py-2 bg-ocean-mid text-sand-light rounded-md hover:bg-ocean-deep transition-all"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
