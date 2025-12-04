import { useUnitContext } from "../../hooks/useUnitContext";

const CoreDetails = ({ form, handleChange, missingFields = [], isEdit }) => {
    const today = new Date().toISOString().split("T")[0];
    const { unitSystem, dispatch } = useUnitContext();

    // for error styling
    const getInputClass = (fieldName) =>
        `w-full p-3 pr-14 rounded border focus:outline-none ${missingFields.includes(fieldName)
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
            : "border-gray-300 focus:border-ocean-mid focus:ring-1 focus:ring-ocean-light"
        }`;

    const depthUnit = unitSystem === "imperial" ? "ft" : "m";

    const setUnitSystem = (unit) => {
        if (isEdit) return;
        dispatch({
            type: "SET_UNIT_SYSTEM",
            payload: unit
        });
    };

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Core Dive Info</h3>

            <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Log dive using:</span>

                {!isEdit ? (
                    // Toggle when logging new dive
                    <div className="flex gap-2">
                        <button
                            onClick={() => setUnitSystem('metric')}
                            className={`px-4 py-2 rounded-md border ${unitSystem === 'metric'
                                    ? 'bg-ocean-mid text-white border-ocean-mid'
                                    : 'bg-white border-gray-300 text-gray-700 font-medium'
                                }`}
                        >
                            Metric
                        </button>

                        <button
                            onClick={() => setUnitSystem('imperial')}
                            className={`px-4 py-2 rounded-md border ${unitSystem === 'imperial'
                                    ? 'bg-ocean-mid text-white border-ocean-mid'
                                    : 'bg-white border-gray-300 text-gray-700 font-medium'
                                }`}
                        >
                            Imperial
                        </button>
                    </div>
                ) : (
                    // Does not allow change of units on edit
                    <div className="relative text-m font-semibold text-ocean-deep">
                        <span className="text-ocean-mid capitalize">{unitSystem}</span>
                    </div>
                )}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Dive Title*</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        placeholder="e.g. Morning Shore Dive"
                        onChange={handleChange}
                        className={getInputClass("title")}
                    />
                </div>

                {/* Dive Site */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Dive Site*</label>
                    <input
                        type="text"
                        name="diveSite"
                        value={form.diveSite}
                        placeholder="e.g. La Jolla Cove"
                        onChange={handleChange}
                        className={getInputClass("diveSite")}
                    />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Date*</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        max={today}
                        onChange={handleChange}
                        className={getInputClass("date")}
                    />
                </div>

                {/* Time */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={form.time || ""}
                        onChange={handleChange}
                        className={getInputClass("time")}
                    />
                </div>

                {/* Max Depth */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Max Depth*</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="maxDepthMeters"
                            value={form.maxDepthMeters}
                            onChange={handleChange}
                            placeholder={unitSystem === "imperial" ? "e.g. 60" : "e.g. 20"}
                            min={0}
                            className={getInputClass("maxDepthMeters")}
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">{depthUnit}</span>
                    </div>
                </div>

                {/* Average Depth */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Average Depth</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="avgDepthMeters"
                            value={form.avgDepthMeters}
                            onChange={handleChange}
                            placeholder={unitSystem === "imperial" ? "e.g. 60" : "e.g. 20"}
                            min={0}
                            className={getInputClass("avgDepthMeters")}
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">{depthUnit}</span>
                    </div>
                </div>

                {/* Bottom Time */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Bottom Time*</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="bottomTimeMinutes"
                            value={form.bottomTimeMinutes}
                            onChange={handleChange}
                            placeholder="e.g. 42"
                            min={0}
                            className={getInputClass("bottomTimeMinutes")}
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">min</span>
                    </div>
                </div>

                {/* Entry Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Entry Type*</label>
                    <select
                        name="entryType"
                        value={form.entryType}
                        onChange={handleChange}
                        className={getInputClass("entryType")}
                    >
                        <option value="">Select entry type</option>
                        <option value="boat">Boat</option>
                        <option value="shore">Shore</option>
                        <option value="liveaboard">Liveaboard</option>
                        <option value="other">Other</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default CoreDetails;
