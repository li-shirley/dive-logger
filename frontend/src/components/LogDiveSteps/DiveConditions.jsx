const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };

const DiveConditions = ({ form, handleChange }) => (
    <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
        <h3 className="text-ocean-deep text-xl font-semibold">Dive Conditions</h3>

        {/* Numeric Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { label: "Visibility", name: "visibilityMeters", unit: "m", placeholder: "e.g. 12" },
                { label: "Water Temp", name: "waterTempC", unit: "°C", step: 0.1, placeholder: "e.g. 22.5" },
                { label: "Air Temp", name: "airTempC", unit: "°C", step: 0.1, placeholder: "e.g. 26" },
            ].map(field => (
                <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">{field.label}</label>

                    <div className="relative">
                        <input
                            type="number"
                            step={field.step}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="w-full p-3 pr-14 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            {field.unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {/* Surge + Current */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { label: "Surge", name: "surge", options: Object.keys(SURGE_CURRENT_LABELS) },
                { label: "Current", name: "current", options: Object.keys(SURGE_CURRENT_LABELS) },
            ].map(field => (
                <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">{field.label}</label>

                    <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                    >
                        <option value="">Select</option>
                        {field.options.map(opt => (
                            <option key={opt} value={opt}>
                                {SURGE_CURRENT_LABELS[opt]}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    </div>
);

export default DiveConditions;
