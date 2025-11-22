const ReviewDiveSummary = ({ form }) => {
    const ENTRY_TYPE_LABELS = { boat: "Boat", shore: "Shore", liveaboard: "Liveaboard", other: "Other" };
    const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };
    const TANK_TYPES = { aluminum: "Aluminum", steel: "Steel" };
    const GAS_MIXES = { air: "Air", ean32: "EAN32", ean36: "EAN36", ean40: "EAN40", customNitrox: "Custom Nitrox" };
    const SUIT_TYPE_LABELS = { none: "None", shortie: "Shortie", full: "Full", drysuit: "Drysuit", other: "Other" };
    const WEIGHT_TYPES = { belt: "Belt", integrated: "Integrated", trim: "Trim Pockets", ankle: "Ankle Weights" };

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
                    {form.maxDepthMeters && <p><strong>Max Depth:</strong> {form.maxDepthMeters} m</p>}
                    {form.avgDepthMeters && <p><strong>Avg Depth:</strong> {form.avgDepthMeters} m</p>}
                    {form.bottomTimeMinutes && <p><strong>Bottom Time:</strong> {form.bottomTimeMinutes} min</p>}
                    {form.entryType && <p><strong>Entry Type:</strong> {ENTRY_TYPE_LABELS[form.entryType]}</p>}
                </div>
            )}

            {/* Conditions */}
            {(form.visibilityMeters || form.waterTempC || form.airTempC || form.surge || form.current) && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Conditions</h3>
                    {form.visibilityMeters && <p><strong>Visibility:</strong> {form.visibilityMeters} m</p>}
                    {form.waterTempC && <p><strong>Water Temp:</strong> {form.waterTempC} °C</p>}
                    {form.airTempC && <p><strong>Air Temp:</strong> {form.airTempC} °C</p>}
                    {form.surge && <p><strong>Surge:</strong> {SURGE_CURRENT_LABELS[form.surge]}</p>}
                    {form.current && <p><strong>Current:</strong> {SURGE_CURRENT_LABELS[form.current]}</p>}
                </div>
            )}

            {/* Tank & Gas */}
            {(form.tankType || form.internalVolumeLiters || form.ratedPressureBar || form.gasMix) && (
                <div className={sectionClass}>
                    <h3 className="font-medium text-ocean-mid mb-2">Tank & Gas</h3>
                    {form.tankType && <p><strong>Tank Type:</strong> {TANK_TYPES[form.tankType]}</p>}
                    {form.internalVolumeLiters && <p><strong>Volume:</strong> {form.internalVolumeLiters} L</p>}
                    {form.ratedPressureBar && <p><strong>Rated Pressure:</strong> {form.ratedPressureBar} bar</p>}
                    {form.gasMix && <p><strong>Gas Mix:</strong> {GAS_MIXES[form.gasMix]}</p>}
                    {form.startPressureBar && <p><strong>Start Pressure:</strong> {form.startPressureBar} bar</p>}
                    {form.endPressureBar && <p><strong>End Pressure:</strong> {form.endPressureBar} bar</p>}
                    {amountUsed !== null && <p><strong>Amount Used:</strong> {amountUsed} bar</p>}
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
                    <p><strong>Weight:</strong> {form.weightKg} kg</p>
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