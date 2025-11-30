import { useUnitContext } from "../../hooks/useUnitContext";
const SURGE_CURRENT_LABELS = { none: "None", light: "Light", medium: "Medium", strong: "Strong" };

const DiveConditions = ({ form, handleChange }) => {
    const { unitSystem } = useUnitContext();

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Dive Conditions</h3>

            {/* Numeric Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Visibility */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Visibility</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="visibilityMeters"
                            value={form.visibilityMeters}
                            onChange={handleChange}
                            placeholder={unitSystem === "imperial" ? "e.g. 40" : "e.g. 12"}
                            className="w-full p-3 pr-14 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            {unitSystem === "imperial" ? "ft" : "m"}
                        </span>
                    </div>
                </div>

                {/* Water Temp */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Water Temp</label>
                    <div className="relative">
                        <input
                            type="number"
                            step={0.1}
                            name="waterTempC"
                            value={form.waterTempC}
                            onChange={handleChange}
                            placeholder={unitSystem === "imperial" ? "e.g. 75" : "e.g. 24"}
                            className="w-full p-3 pr-14 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            {unitSystem === "imperial" ? "°F" : "°C"}
                        </span>
                    </div>
                </div>

                {/* Air Temp */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Air Temp</label>
                    <div className="relative">
                        <input
                            type="number"
                            step={0.1}
                            name="airTempC"
                            value={form.airTempC}
                            onChange={handleChange}
                            placeholder={unitSystem === "imperial" ? "e.g. 78" : "e.g. 26"}
                            className="w-full p-3 pr-14 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            {unitSystem === "imperial" ? "°F" : "°C"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Surge + Current */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
};

export default DiveConditions;
