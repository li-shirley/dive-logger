import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import { useDiveContext } from '../hooks/useDiveContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { apiFetch } from '../utils/api';

const ENTRY_TYPE_LABELS = { boat: "Boat", shore: "Shore", liveaboard: "Liveaboard", other: "Other" };
const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };
const TANK_TYPES = { aluminum: "Aluminum", steel: "Steel" };
const GAS_MIXES = { air: "Air", ean32: "EAN32", ean36: "EAN36", ean40: "EAN40", customNitrox: "Custom Nitrox" };
const SUIT_TYPE_LABELS = { none: "None", shortie: "Shortie", full: "Full", drysuit: "Drysuit", other: "Other" };
const WEIGHT_TYPES = { belt: "Belt", integrated: "Integrated", trim: "Trim Pockets", ankle: "Ankle Weights" };

const DiveDetails = ({ dive }) => {
    const { dispatch: diveDispatch } = useDiveContext();
    const { user } = useAuthContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const handleDelete = async () => {
        if (!user) {
            setError('You must be logged in to delete a dive');
            return;
        }
        setIsDeleting(true);
        setError(null);

        try {
            const response = await apiFetch(`/api/dives/${dive._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.error || 'Failed to delete dive');
            } else {
                diveDispatch({ type: 'DELETE_DIVE', payload: dive });
            }
        } catch (err) {
            console.error(err);
            setError('Server error while deleting dive');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-sand-mid rounded-xl shadow-md p-4 flex flex-col gap-2 relative transition-all">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-ocean-deep font-semibold text-lg">{dive.diveSite}</h4>
                    <p className="text-gray-700 text-sm">{format(new Date(dive.date), "MMM d, yyyy")}</p>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Delete dive"
                    className="text-coral hover:text-red-600 transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>

            {/* Core info */}
            <div className="flex flex-wrap gap-6 text-gray-700">
                {dive.maxDepthMeters && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Max Depth:</span>
                        <span>{dive.maxDepthMeters} m</span>
                    </div>
                )}
                {dive.avgDepthMeters && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Avg Depth:</span>
                        <span>{dive.avgDepthMeters} m</span>
                    </div>
                )}
                {dive.bottomTimeMinutes && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Bottom Time:</span>
                        <span>{dive.bottomTimeMinutes} min</span>
                    </div>
                )}
                {dive.entryType && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Entry Type:</span>
                        <span>{ENTRY_TYPE_LABELS[dive.entryType]}</span>
                    </div>
                )}
            </div>

            {dive.rating && <p className="text-yellow-500 mt-1">{'⭐'.repeat(dive.rating)}</p>}

            <p className="text-xs text-gray-500 italic">
                Logged {formatDistanceToNow(new Date(dive.createdAt), { addSuffix: true })}
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Expand/Collapse Button */}
            <button
                onClick={() => setExpanded(prev => !prev)}
                className="text-ocean-mid text-sm font-medium mt-2 self-start hover:underline"
            >
                {expanded ? 'Show Less' : 'Show More'}
            </button>

            {/* Expanded content */}
            {expanded && (
                <div className="mt-2 border-t border-gray-300 pt-2 text-sm space-y-1">
                    {dive.visibilityMeters && <p><strong>Visibility:</strong> {dive.visibilityMeters} m</p>}
                    {dive.waterTempC && <p><strong>Water Temp:</strong> {dive.waterTempC} °C</p>}
                    {dive.airTempC && <p><strong>Air Temp:</strong> {dive.airTempC} °C</p>}
                    {dive.surge && <p><strong>Surge:</strong> {SURGE_CURRENT_LABELS[dive.surge]}</p>}
                    {dive.current && <p><strong>Current:</strong> {SURGE_CURRENT_LABELS[dive.current]}</p>}

                    {dive.tank && (
                        <div>
                            <p>
                                <strong>Tank:</strong> {TANK_TYPES[dive.tank.tankType]} ({dive.tank.internalVolumeLiters} L, {dive.tank.ratedPressureBar} bar)
                            </p>
                            <p><strong>Gas Mix:</strong> {GAS_MIXES[dive.tank.gasMix]}</p>
                        </div>
                    )}

                    {dive.pressure && (
                        <p>
                            <strong>Used Air:</strong> {dive.pressure.amountUsedBar ?? (dive.pressure.startPressureBar && dive.pressure.endPressureBar ? dive.pressure.startPressureBar - dive.pressure.endPressureBar : '-')} bar
                        </p>
                    )}

                    {dive.exposureSuit && (
                        <p>
                            <strong>Suit:</strong> {SUIT_TYPE_LABELS[dive.exposureSuit.type]} {dive.exposureSuit.thicknessMm ? `(${dive.exposureSuit.thicknessMm} mm)` : ''} {dive.exposureSuit.otherText && `- ${dive.exposureSuit.otherText}`}
                        </p>
                    )}

                    {dive.weight && (
                        <p>
                            <strong>Weight:</strong> {dive.weight.weightKg} kg {dive.weight.weightType?.length > 0 && `(${dive.weight.weightType.map(type => WEIGHT_TYPES[type]).join(', ')})`}
                        </p>
                    )}

                    {dive.lifeSeen?.length > 0 && (
                        <div>
                            <strong>Marine Life Seen:</strong>
                            <ul className="list-disc ml-4">
                                {dive.lifeSeen.map((item, idx) => (
                                    <li key={idx}>{item.group}{item.detail && ` (${item.detail})`}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {dive.additionalNotes && <p><strong>Notes:</strong> {dive.additionalNotes}</p>}
                </div>
            )}
        </div>
    );
};

export default DiveDetails;
