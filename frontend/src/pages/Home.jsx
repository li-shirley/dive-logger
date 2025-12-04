import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';

import { useDiveContext } from '../hooks/useDiveContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUnitContext } from "../hooks/useUnitContext";

import DiveDetails from '../components/DiveDetails';
import { apiFetch } from '../utils/api';

const Home = () => {
    const { dives, dispatch: diveDispatch } = useDiveContext();
    const { user, dispatch: authDispatch, refreshToken: authRefreshToken } = useAuthContext();
    const { unitSystem, dispatch } = useUnitContext();

    const fetchedRef = useRef(false);

    const toggleUnits = () => {
        dispatch({
            type: "SET_UNIT_SYSTEM",
            payload: unitSystem === "metric" ? "imperial" : "metric"
        });
    };

    useEffect(() => {
        if (!user || fetchedRef.current) return;

        const fetchDives = async () => {
            try {
                const { res, json } = await apiFetch('/api/dives', {}, {
                    user,
                    refreshToken: authRefreshToken,
                    dispatch: authDispatch
                });

                if (res.ok) {
                    diveDispatch({ type: 'SET_DIVES', payload: json });
                    fetchedRef.current = true; // mark as fetched
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDives();
    }, [user, authDispatch, diveDispatch, authRefreshToken]);

    const breakpointColumns = {
        default: 3,
        1024: 2,
        640: 1
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Unit system */}
                <div className="flex items-center gap-3">
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
                            <span
                                className={
                                    unitSystem === "metric"
                                        ? "text-sand-mid"
                                        : "text-ocean-deep"
                                }
                            >
                                Metric
                            </span>
                            <span
                                className={
                                    unitSystem === "imperial"
                                        ? "text-sand-mid"
                                        : "text-ocean-deep"
                                }
                            >
                                Imperial
                            </span>
                        </span>
                    </button>
                </div>

                {/* Log Dive button */}
                <Link
                    to="/log-dive"
                    className="px-3 py-1 rounded-md bg-ocean-mid text-sand-light hover:bg-ocean-deep transition-all self-start sm:self-auto"
                >
                    Log Dive
                </Link>
            </div>


            {dives?.length > 0 ? (
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {dives.map(dive => (
                        <DiveDetails key={dive._id} dive={dive} />
                    ))}
                </Masonry>


            ) : (
                <p className="text-center text-ocean-mid text-lg font-medium mt-12">
                    No dives logged yet. Click "Log Dive" to log your first dive!
                </p>
            )}
        </div>
    );
}

export default Home;
