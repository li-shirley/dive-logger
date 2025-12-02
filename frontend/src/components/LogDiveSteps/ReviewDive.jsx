import { useUnitContext } from "../../hooks/useUnitContext";
import { formatTime12h } from "../../utils/unitConversions";

const ReviewDiveSummary = ({ form }) => {
    const { unitSystem } = useUnitContext();

    const ENTRY_TYPE_LABELS = { boat: "Boat", shore: "Shore", liveaboard: "Liveaboard", other: "Other" };
    const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };
    const GAS_MIXES = { air: "Air", ean32: "EAN32", ean36: "EAN36", ean40: "EAN40", customNitrox: "Custom Nitrox" };
    const SUIT_TYPE_LABELS = { none: "None", shortie: "Shortie", full: "Full", drysuit: "Drysuit", other: "Other" };
    const WEIGHT_TYPES = { belt: "Belt", integrated: "Integrated", trim: "Trim Pockets", ankle: "Ankle Weights" };
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

    const renderStars = (rating) => "⭐".repeat(rating || 0);
    const amountUsed = form.startPressureBar && form.endPressureBar ? form.startPressureBar - form.endPressureBar : null;
    const activeLifeSeen = form.lifeSeen.filter(item => item.active);

    const sectionClass = "bg-sand-light p-6 rounded-xl shadow-md";

    return (
        <div className="step step-review w-full max-w-3xl mx-auto flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-ocean-deep">Review Your Dive</h2>

            {/* Core Details */}
            {form.title && form.diveSite && form.date && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Core Details</h3>
                    {form.title && <p><strong>Title:</strong> {form.title}</p>}
                    {form.diveSite && <p><strong>Dive Site:</strong> {form.diveSite}</p>}
                    {form.date && <p><strong>Date:</strong> {form.date}</p>}
                    {form.time && (
                        <p><strong>Time:</strong> {formatTime12h(form.time)}</p>
                    )}
                    {form.maxDepthMeters && <p><strong>Max Depth:</strong> {form.maxDepthMeters}  {unitSystem === "imperial" ? "ft" : "m"}</p>}
                    {form.avgDepthMeters && <p><strong>Avg Depth:</strong> {form.avgDepthMeters}  {unitSystem === "imperial" ? "ft" : "m"}</p>}
                    {form.bottomTimeMinutes && <p><strong>Bottom Time:</strong> {form.bottomTimeMinutes} min</p>}
                    {form.entryType && <p><strong>Entry Type:</strong> {ENTRY_TYPE_LABELS[form.entryType]}</p>}
                </div>
            )}

            {/* Conditions */}
            {(form.visibilityMeters || form.waterTempC || form.airTempC || form.surge || form.current) && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Conditions</h3>
                    {form.visibilityMeters && <p><strong>Visibility:</strong> {form.visibilityMeters}   {unitSystem === "imperial" ? "ft" : "m"}</p>}
                    {form.waterTempC && <p><strong>Water Temp:</strong> {form.waterTempC} {unitSystem === "imperial" ? "°F" : "°C"}</p>}
                    {form.airTempC && <p><strong>Air Temp:</strong> {form.airTempC} {unitSystem === "imperial" ? "°F" : "°C"}</p>}
                    {form.surge && <p><strong>Surge:</strong> {SURGE_CURRENT_LABELS[form.surge]}</p>}
                    {form.current && <p><strong>Current:</strong> {SURGE_CURRENT_LABELS[form.current]}</p>}
                </div>
            )}

            {/* Tank & Gas */}
            {(form.tankLabel || form.gasMix) && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Tank & Gas</h3>
                    {form.tankLabel && form.tankLabel !== "Other" && (
                        <p>
                            <strong>Tank:</strong> {form.tankLabel}
                            {unitSystem === "metric"
                                ? ` (${TANKS_SPECS[form.tankLabel].volumeL} L @ ${TANKS_SPECS[form.tankLabel].pressureBar} bar)`
                                : ` (${TANKS_SPECS[form.tankLabel].volumeCuFt} cu ft @ ${TANKS_SPECS[form.tankLabel].pressurePsi} psi)`}
                        </p>
                    )}
                    {form.tankLabel === "Other" && (
                        <p>
                            <strong>Tank:</strong> {form.customSpecs}
                        </p>
                    )}
                    {form.gasMix && <p><strong>Gas Mix:</strong> {GAS_MIXES[form.gasMix]}</p>}
                    {form.startPressureBar && <p><strong>Start Pressure:</strong> {form.startPressureBar} {unitSystem === "imperial" ? "psi" : "bar"}</p>}
                    {form.endPressureBar && <p><strong>End Pressure:</strong> {form.endPressureBar} {unitSystem === "imperial" ? "psi" : "bar"}</p>}
                    {amountUsed !== null && <p><strong>Amount Used:</strong> {amountUsed} {unitSystem === "imperial" ? "psi" : "bar"}</p>}
                </div>
            )}

            {/* Exposure Suit */}
            {form.suitType && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Exposure Suit</h3>
                    <p><strong>Suit Type:</strong> {SUIT_TYPE_LABELS[form.suitType]}</p>
                    {form.thicknessMm && <p><strong>Thickness:</strong> {form.thicknessMm} mm</p>}
                    {form.suitType === "other" && form.suitOtherText && <p><strong>Notes:</strong> {form.suitOtherText}</p>}
                </div>
            )}

            {/* Weight */}
            {form.weightKg && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Weight</h3>
                    <p><strong>Weight:</strong> {form.weightKg} {unitSystem === "imperial" ? "lb" : "kg"}</p>
                    {form.weightType.length > 0 && (
                        <p><strong>Type:</strong> {form.weightType.map(type => WEIGHT_TYPES[type] || type).join(", ")}</p>
                    )}
                </div>
            )}

            {/* Misc */}
            {(form.rating || activeLifeSeen.length || form.additionalNotes) && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Misc</h3>
                    {form.rating && <p><strong>Rating:</strong> {renderStars(form.rating)}</p>}
                    {activeLifeSeen.length > 0 && (
                        <div>
                            <strong>Marine Life:</strong>
                            <ul className="ml-4 list-disc">
                                {activeLifeSeen.map((item, idx) => (
                                    <li key={idx}>{item.group}{item.detail && ` (${item.detail})`}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {form.additionalNotes && <p><strong>Notes:</strong> {form.additionalNotes}</p>}
                </div>
            )}
        </div>
    );
};

export default ReviewDiveSummary;