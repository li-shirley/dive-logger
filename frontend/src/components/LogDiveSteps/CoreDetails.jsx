const CoreDetails = ({ form, handleChange, missingFields = [] }) => {
    const today = new Date().toISOString().split('T')[0];

    const getInputClass = (fieldName) =>
        missingFields.includes(fieldName)
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-ocean-mid focus:ring-ocean-light";

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Core Dive Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Text + Date fields */}
                {[
                    { label: "Dive Title*", name: "title", type: "text", placeholder: "e.g. Morning Shore Dive" },
                    { label: "Dive Site*", name: "diveSite", type: "text", placeholder: "e.g. La Jolla Cove, California" },
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

                {/* Numeric fields with unit indicators */}
                {[
                    { label: "Max Depth*", name: "maxDepthMeters", unit: "m", placeholder: "e.g. 18" },
                    { label: "Bottom Time*", name: "bottomTimeMinutes", unit: "min", placeholder: "e.g. 42" },
                    { label: "Average Depth", name: "avgDepthMeters", unit: "m", placeholder: "e.g. 12" },
                ].map(field => (
                    <div key={field.name} className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">{field.label}</label>
                        <div className="relative">
                            <input
                                type="number"
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className={`w-full p-3 pr-14 rounded ${getInputClass(field.name)}`}
                            />
                            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                                {field.unit}
                            </span>
                        </div>
                    </div>
                ))}

            </div>

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
export default CoreDetails