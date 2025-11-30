import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from 'date-fns';

import { useDiveContext } from '../hooks/useDiveContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUnitContext } from "../hooks/useUnitContext";

import { apiFetch } from '../utils/api';
import { metersToFeet, kgToLbs, cToF, barToPsi } from "../utils/unitConversions";


const ENTRY_TYPE_LABELS = { boat: "Boat", shore: "Shore", liveaboard: "Liveaboard", other: "Other" };
const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };
const GAS_MIXES = { air: "Air", ean32: "EAN32", ean36: "EAN36", ean40: "EAN40", customNitrox: "Custom Nitrox" };
const SUIT_TYPE_LABELS = { none: "None", shortie: "Shortie", full: "Full", drysuit: "Drysuit", other: "Other" };
const WEIGHT_TYPES = { belt: "Belt", integrated: "Integrated", trim: "Trim Pockets", ankle: "Ankle Weights" };


const DiveDetails = ({ dive }) => {
    const navigate = useNavigate();

    const { dispatch: diveDispatch } = useDiveContext();
    const { user } = useAuthContext();
    const { unitSystem } = useUnitContext();

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // FORMATTERS 
    const formatLength = (meters) =>
        unitSystem === "imperial"
            ? `${metersToFeet(meters).toFixed(1)} ft`
            : `${meters.toFixed(1)} m`;

    const formatWeight = (kg) =>
        unitSystem === "imperial"
            ? `${kgToLbs(kg).toFixed(1)} lbs`
            : `${kg.toFixed(1)} kg`;

    const formatTemp = (celsius) =>
        unitSystem === "imperial"
            ? `${cToF(celsius).toFixed(0)} °F`
            : `${celsius.toFixed(1)} °C`;

    const formatPressure = (bar) =>
        unitSystem === "imperial"
            ? `${Math.round(barToPsi(bar))} psi`
            : `${bar.toFixed(1)} bar`;

    const TANKS_SPECS = {
        AL80: { volumeL: 11, volumeCuFt: 80, pressureBar: 207, pressurePsi: 3000 },
        AL63: { volumeL: 10, volumeCuFt: 63, pressureBar: 207, pressurePsi: 3000 },
        AL50: { volumeL: 7.8, volumeCuFt: 50, pressureBar: 207, pressurePsi: 3000 },
        AL40: { volumeL: 6.3, volumeCuFt: 40, pressureBar: 207, pressurePsi: 3000 },
        AL30: { volumeL: 4.8, volumeCuFt: 30, pressureBar: 207, pressurePsi: 3000 },
        Steel100: { volumeL: 15, volumeCuFt: 100, pressureBar: 232, pressurePsi: 3360 },
        Steel80: { volumeL: 11, volumeCuFt: 80, pressureBar: 232, pressurePsi: 3360 },
        Steel60: { volumeL: 9, volumeCuFt: 60, pressureBar: 232, pressurePsi: 3360 },
    };

    // UPDATE DIVE
    const handleEdit = (dive) => {
        navigate(`/log-dive/${dive._id}`, { state: { dive } });
    };

    // DELETE DIVE 
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

            if (response.ok) {
                diveDispatch({ type: 'DELETE_DIVE', payload: dive });
            } else {
                const json = await response.json();
                setError(json.error || 'Failed to delete dive');
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
                    <h4 className="text-ocean-deep font-semibold text-lg">{dive.title}</h4>
                    <p className="text-gray-700 text-sm">{format(new Date(dive.date), "MMM d, yyyy")}</p>
                </div>

                <div className="flex gap-2">
                    {/* Edit/Update Button */}
                    <button
                        onClick={() => handleEdit(dive)}
                        className="text-ocean-mid hover:text-ocean-deep transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            edit_note
                        </span>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        className="text-coral-deep hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>


            </div>

            {/* Core Info */}
            <div className="flex flex-wrap gap-6 text-gray-700">
                {dive.maxDepthMeters && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Dive Site:</span>
                        <span className="text-coral-mid">{dive.diveSite}</span>
                    </div>
                )}

                {dive.maxDepthMeters && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Max Depth:</span>
                        <span>{formatLength(dive.maxDepthMeters)}</span>
                    </div>
                )}

                {dive.avgDepthMeters && (
                    <div className="flex gap-1 items-center">
                        <span className="font-semibold">Avg Depth:</span>
                        <span>{formatLength(dive.avgDepthMeters)}</span>
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

            {/* Expand Toggle */}
            <button
                onClick={() => setExpanded(prev => !prev)}
                className="text-ocean-mid text-sm font-medium mt-2 self-start hover:underline"
            >
                {expanded ? 'Show Less' : 'Show More'}
            </button>

            {/* Expanded Section */}
            {expanded && (
                <div className="mt-2 border-top border-gray-300 pt-2 text-sm space-y-1">

                    {dive.visibilityMeters && (
                        <p><strong>Visibility:</strong> {formatLength(dive.visibilityMeters)}</p>
                    )}

                    {dive.waterTempC && (
                        <p><strong>Water Temp:</strong> {formatTemp(dive.waterTempC)}</p>
                    )}

                    {dive.airTempC && (
                        <p><strong>Air Temp:</strong> {formatTemp(dive.airTempC)}</p>
                    )}

                    {dive.surge && (
                        <p><strong>Surge:</strong> {SURGE_CURRENT_LABELS[dive.surge]}</p>
                    )}

                    {dive.current && (
                        <p><strong>Current:</strong> {SURGE_CURRENT_LABELS[dive.current]}</p>
                    )}

                    {dive.tank && (
                        <div>
                            <p>
                                <strong>Tank:</strong>{" "}
                                {dive.tank.tankLabel === "Other"
                                    ? dive.tank.customSpecs
                                    : `${dive.tank.tankLabel} ${TANKS_SPECS[dive.tank.tankLabel]
                                        ? `(${unitSystem === "metric"
                                            ? `${TANKS_SPECS[dive.tank.tankLabel].volumeL} L @ ${TANKS_SPECS[dive.tank.tankLabel].pressureBar} bar`
                                            : `${TANKS_SPECS[dive.tank.tankLabel].volumeCuFt} cu ft @ ${TANKS_SPECS[dive.tank.tankLabel].pressurePsi} psi`
                                        })`
                                        : ""
                                    }`}
                            </p>

                            {dive.tank.gasMix && (
                                <p>
                                    <strong>Gas Mix:</strong> {GAS_MIXES[dive.tank.gasMix]}
                                </p>
                            )}
                        </div>
                    )}

                    {dive.pressure && (
                        <p>
                            <strong>Used Air:</strong>{" "}
                            {(() => {
                                const usedBar =
                                    dive.pressure.amountUsedBar ??
                                    (dive.pressure.startPressureBar &&
                                        dive.pressure.endPressureBar
                                        ? dive.pressure.startPressureBar - dive.pressure.endPressureBar
                                        : null);

                                return usedBar !== null
                                    ? formatPressure(usedBar)
                                    : "-";
                            })()}
                        </p>
                    )}


                    {dive.exposureSuit && (
                        <p>
                            <strong>Suit:</strong>
                            {" "}
                            {SUIT_TYPE_LABELS[dive.exposureSuit.type]}
                            {dive.exposureSuit.thicknessMm
                                ? ` (${dive.exposureSuit.thicknessMm} mm)`
                                : ""}
                            {" "}
                            {dive.exposureSuit.otherText && `- ${dive.exposureSuit.otherText}`}
                        </p>
                    )}

                    {dive.weightKg && (
                        <p>
                            <strong>Weight:</strong>
                            {" "}
                            {formatWeight(dive.weight.weightKg)}
                            {" "}
                            {dive.weight.weightType?.length > 0 &&
                                `(${dive.weight.weightType.map(type => WEIGHT_TYPES[type]).join(', ')})`}
                        </p>
                    )}

                    {dive.lifeSeen?.length > 0 && (
                        <div>
                            <strong>Marine Life Seen:</strong>
                            <ul className="list-disc ml-4">
                                {dive.lifeSeen.map((item, idx) => (
                                    <li key={idx}>
                                        {item.group}
                                        {item.detail && ` (${item.detail})`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {dive.additionalNotes && (
                        <p><strong>Notes:</strong> {dive.additionalNotes}</p>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Delete this dive?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    handleDelete();
                                }}
                                className="px-4 py-2 rounded bg-coral-deep text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DiveDetails;
