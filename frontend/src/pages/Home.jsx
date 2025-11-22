import { useEffect } from 'react';
import { useDiveContext } from '../hooks/useDiveContext';
import { useAuthContext } from '../hooks/useAuthContext';
// import { useUnitContext } from "../hooks/useUnitContext";

import DiveDetails from '../components/DiveDetails';
import { apiFetch } from '../utils/api';

const Home = () => {
    const { dives, dispatch: diveDispatch } = useDiveContext();
    const { user, dispatch: authDispatch } = useAuthContext();
    // const { unitSystem, dispatch } = useUnitContext();

    // const toggleUnits = () => {
    //     dispatch({
    //         type: "SET_UNIT_SYSTEM",
    //         payload: unitSystem === "metric" ? "imperial" : "metric"
    //     });
    // };

    useEffect(() => {
        const fetchDives = async () => {
            if (!user) return;

            try {
                const response = await apiFetch('/api/dives', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }, authDispatch);

                if (!response) return;

                const json = await response.json();

                if (response.ok) {
                    diveDispatch({ type: 'SET_DIVES', payload: json });
                } else {
                    console.error('Failed to fetch dives:', json.error);
                }
            } catch (error) {
                console.error('Network error fetching dives:', error);
            }
        };

        fetchDives();
    }, [user, authDispatch, diveDispatch]);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">

            {/* <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-700 font-medium">Unit System:</span>

                <button
                    onClick={toggleUnits}
                    className="relative w-44 h-10 bg-sand-mid rounded-full flex items-center cursor-pointer select-none"
                >
                    <span
                        className={`absolute top-0 left-0 w-1/2 h-full bg-ocean-deep rounded-full shadow-md transition-transform ${unitSystem === "imperial" ? "translate-x-full" : ""
                            }`}
                    ></span>

                    <span className="relative z-10 w-full flex justify-between px-4 text-sm font-semibold">
                        <span className={unitSystem === "metric" ? "text-sand-mid" : "text-ocean-deep"}>Metric</span>
                        <span className={unitSystem === "imperial" ? "text-sand-mid" : "text-ocean-deep"}>Imperial</span>
                    </span>
                </button>
            </div> */}

            {dives?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                    {dives.map(dive => (
                        <DiveDetails key={dive._id} dive={dive} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-ocean-mid text-lg font-medium mt-12">
                    No dives logged yet.
                </p>
            )}
        </div>
    );
}

export default Home;
