import { useUnitContext } from "../../hooks/useUnitContext";

const CoreDetails = ({ form, handleChange, missingFields = [], isEdit }) => {
    const today = new Date().toISOString().split("T")[0];
    const { unitSystem, dispatch } = useUnitContext();

    const getInputClass = (fieldName) =>
        missingFields.includes(fieldName)
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-ocean-mid focus:ring-ocean-light";

    const depthUnit = unitSystem === "imperial" ? "ft" : "m";

    const toggleUnits = () => {
        if (isEdit) return;
        dispatch({
            type: "SET_UNIT_SYSTEM",
            payload: unitSystem === "metric" ? "imperial" : "metric"
        });
    };

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Core Dive Info</h3>

            <div className="flex items-center gap-3 justify-start">
                <span className="text-gray-700 font-medium">Unit System:</span>

                {!isEdit ? (
                    // Toggle when logging new dive
                    <button
                        onClick={toggleUnits}
                        className="relative w-44 h-10 rounded-full flex items-center bg-sand-mid cursor-pointer select-none"
                    >
                        <span
                            className={`absolute top-0 left-0 w-1/2 h-full bg-ocean-deep rounded-full shadow-md transition-transform ${unitSystem === "imperial" ? "translate-x-full" : ""
                                }`}
                        ></span>

                        <span className="relative z-10 w-full flex justify-between px-4 text-sm font-semibold">
                            <span className={unitSystem === "metric" ? "text-sand-mid" : "text-ocean-deep"}>
                                Metric
                            </span>
                            <span className={unitSystem === "imperial" ? "text-sand-mid" : "text-ocean-deep"}>
                                Imperial
                            </span>
                        </span>
                    </button>
                ) : (
                    // Does not toggle on edit
                    <div className="relative text-m font-semibold text-ocean-deep">
                        <span className="text-ocean-mid capitalize">{unitSystem}</span>
                    </div>
                )}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title, Site, Date */}
                {[
                    { label: "Dive Title*", name: "title", type: "text", placeholder: "e.g. Morning Shore Dive" },
                    { label: "Dive Site*", name: "diveSite", type: "text", placeholder: "e.g. La Jolla Cove" },
                    { label: "Date*", name: "date", type: "date", max: today },
                ].map(field => (
                    <div key={field.name} className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={form[field.name]}
                            max={field.max}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            className={`w-full p-3 rounded ${getInputClass(field.name)}`}
                        />
                    </div>
                ))}

                {/* Depths */}
                {[
                    { label: "Max Depth*", name: "maxDepthMeters" },
                    { label: "Average Depth", name: "avgDepthMeters" },
                ].map(field => (
                    <div key={field.name} className="flex flex-col gap-2 relative">
                        <label className="text-gray-700 font-medium">{field.label}</label>
                        <div className="relative">
                            <input
                                type="number"
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={`e.g. ${field.label === "Max Depth*" ? "60" : "40"}`}
                                className={`w-full p-3 pr-14 rounded ${getInputClass(field.name)}`}
                            />
                            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">{depthUnit}</span>
                        </div>
                    </div>
                ))}

                {/* Bottom time */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Bottom Time*</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="bottomTimeMinutes"
                            value={form.bottomTimeMinutes}
                            onChange={handleChange}
                            placeholder="e.g. 42"
                            className={`w-full p-3 pr-14 rounded ${getInputClass("bottomTimeMinutes")}`}
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">min</span>
                    </div>
                </div>
            </div>

            {/* Entry type */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Entry Type*</label>
                <select
                    name="entryType"
                    value={form.entryType}
                    onChange={handleChange}
                    className={`w-full p-3 rounded ${getInputClass("entryType")}`}
                >
                    <option value="">Select entry type</option>
                    <option value="boat">Boat</option>
                    <option value="shore">Shore</option>
                    <option value="liveaboard">Liveaboard</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
    );
};

export default CoreDetails;
