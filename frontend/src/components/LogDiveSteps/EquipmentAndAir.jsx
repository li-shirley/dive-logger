import { useUnitContext } from "../../hooks/useUnitContext";
import { format1 } from "../../utils/unitConversions";

const EquipmentAndAir = ({ form, handleChange }) => {
    const { unitSystem } = useUnitContext();

    const usedPressure =
        form.startPressureBar && form.endPressureBar
            ? Number(form.startPressureBar) - Number(form.endPressureBar)
            : "";

    const weightOptions = [
        { value: "belt", label: "Belt" },
        { value: "integrated", label: "Integrated" },
        { value: "trim", label: "Trim Pockets" },
        { value: "ankle", label: "Ankle Weights" },
    ];

    const tankSpecs = {
        AL80: { volumeL: 11, volumeCuFt: 80, pressureBar: 207, pressurePsi: 3000 },
        AL63: { volumeL: 10, volumeCuFt: 63, pressureBar: 207, pressurePsi: 3000 },
        AL50: { volumeL: 7.8, volumeCuFt: 50, pressureBar: 207, pressurePsi: 3000 },
        AL40: { volumeL: 6.3, volumeCuFt: 40, pressureBar: 207, pressurePsi: 3000 },
        AL30: { volumeL: 4.8, volumeCuFt: 30, pressureBar: 207, pressurePsi: 3000 },
        Steel100: { volumeL: 15, volumeCuFt: 100, pressureBar: 232, pressurePsi: 3360 },
        Steel80: { volumeL: 11, volumeCuFt: 80, pressureBar: 232, pressurePsi: 3360 },
        Steel60: { volumeL: 9, volumeCuFt: 60, pressureBar: 232, pressurePsi: 3360 },
    };

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Equipment & Air</h3>

            {/* Tank */}
            <h4 className="text-ocean-mid font-medium mt-4">Air</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                {/* Tank Label */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Tank</label>
                    <select
                        name="tankLabel"
                        value={form.tankLabel}
                        onChange={handleChange}
                        className="w-full p-3 rounded"
                    >
                        <option value="">Select tank type</option>
                        {Object.entries(tankSpecs).map(([key, spec]) => (
                            <option key={key} value={key}>
                                {unitSystem === "imperial"
                                    ? `${key} (${spec.volumeCuFt} cu ft @ ${spec.pressurePsi} psi)`
                                    : `${key} (${spec.volumeL} L @ ${spec.pressureBar} bar)`}
                            </option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Custom Specs (only if Other is selected) */}
                {form.tankLabel === "Other" && (
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-gray-700 font-medium">Custom Specs</label>
                        <input
                            type="text"
                            name="customSpecs"
                            value={form.customSpecs}
                            onChange={handleChange}
                            placeholder="e.g. 12.5L, special alloy"
                            className="w-full p-3 rounded"
                        />
                    </div>
                )}
            </div>

            {/* Pressure & Gas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

                {/* Gas Mix */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Gas Mix</label>
                    <select
                        name="gasMix"
                        value={form.gasMix}
                        onChange={handleChange}
                        className="w-full p-3 rounded "
                    >
                        <option value="">Select gas mix</option>
                        <option value="air">Air</option>
                        <option value="ean32">EAN32</option>
                        <option value="ean36">EAN36</option>
                        <option value="ean40">EAN40</option>
                        <option value="customNitrox">Custom Nitrox</option>
                    </select>
                </div>

                {/* Start Pressure */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Start Pressure</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="startPressureBar"
                            value={form.startPressureBar}
                            onChange={handleChange}
                            placeholder={`e.g. ${unitSystem === "imperial" ? "3000" : "200"}`}
                            min={0} 
                            className="w-full p-3 pr-14 rounded"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
                            {unitSystem === "imperial" ? "psi" : "bar"}
                        </span>
                    </div>
                </div>

                {/* End Pressure */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">End Pressure</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="endPressureBar"
                            value={form.endPressureBar}
                            onChange={handleChange}
                            placeholder={`e.g. ${unitSystem === "imperial" ? "700" : "50"}`}
                            min={0} 
                            className="w-full p-3 pr-14 rounded"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
                            {unitSystem === "imperial" ? "psi" : "bar"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Estimated Use */}
            {usedPressure !== "" && (
                <p className="mt-2 text-gray-600">
                    <strong>Estimated Used:</strong>{" "}
                    {format1(usedPressure)}{" "}
                    {unitSystem === "imperial" ? "psi" : "bar"}
                </p>
            )}

            {/* Exposure Suit */}
            <h4 className="text-ocean-mid font-medium mt-4">Exposure Suit</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Suit Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Suit Type</label>
                    <select
                        name="suitType"
                        value={form.suitType}
                        onChange={handleChange}
                        className="w-full p-3 rounded"
                    >
                        <option value="">Select suit type</option>
                        <option value="none">None</option>
                        <option value="shortie">Shortie</option>
                        <option value="full">Full Wetsuit</option>
                        <option value="drysuit">Drysuit</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Thickness */}
                {form.suitType !== "drysuit" && (
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-gray-700 font-medium">Thickness</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="thicknessMm"
                                value={form.thicknessMm}
                                onChange={handleChange}
                                placeholder="e.g. 3 / 5 / 7"
                                min={0} 
                                className="w-full p-3 pr-14 rounded"
                            />
                            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
                                mm
                            </span>
                        </div>
                    </div>
                )}

                {/* Suit Description */}
                {form.suitType === "other" && (
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Suit Description</label>
                        <input
                            type="text"
                            name="suitOtherText"
                            value={form.suitOtherText}
                            onChange={handleChange}
                            placeholder="Describe suit"
                            className="w-full p-3 roundedt"
                        />
                    </div>
                )}
            </div>

            {/* Weights */}
            <h4 className="text-ocean-mid font-medium mt-4">Weights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Weight */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Weight</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="weightKg"
                            value={form.weightKg}
                            onChange={handleChange}
                            placeholder="e.g. 6"
                            min={0} 
                            className="w-full p-3 pr-14 rounded"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
                            {unitSystem === "imperial" ? "lb" : "kg"}
                        </span>
                    </div>
                </div>

                {/* Weight Type */}
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Weight Type</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {weightOptions.map((option) => {
                            const checked = form.weightType?.includes(option.value) || false;
                            return (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer ${checked
                                        ? "bg-ocean-mid text-white border-ocean-mid"
                                        : "bg-white border-gray-300 text-gray-700 font-medium"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        checked={checked}
                                        onChange={() => {
                                            const newWeightTypes = checked
                                                ? form.weightType.filter((w) => w !== option.value)
                                                : [...(form.weightType || []), option.value];
                                            handleChange({ target: { name: "weightType", value: newWeightTypes } });
                                        }}
                                        className="hidden"
                                    />
                                    {option.label}
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentAndAir;
