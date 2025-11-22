const EquipmentAndAir = ({ form, handleChange }) => {
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

    const LabeledInputWithUnit = ({ name, value, onChange, placeholder, unit, ...rest }) => (
        <div className="relative">
            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 pr-10 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                {...rest}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{unit}</span>
        </div>
    );

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Equipment & Air</h3>

            {/* Tank */}
            <h4 className="text-ocean-mid font-medium mt-4">Air</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Tank Type</label>
                    <select
                        name="tankType"
                        value={form.tankType}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                    >
                        <option value="">Select tank type</option>
                        <option value="aluminum">Aluminum</option>
                        <option value="steel">Steel</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Tank Volume</label>
                    <LabeledInputWithUnit
                        type="number"
                        name="internalVolumeLiters"
                        value={form.internalVolumeLiters}
                        onChange={handleChange}
                        placeholder="e.g., 11"
                        unit="L"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Rated Pressure</label>
                    <LabeledInputWithUnit
                        type="number"
                        name="ratedPressureBar"
                        value={form.ratedPressureBar}
                        onChange={handleChange}
                        placeholder="e.g., 200"
                        unit="bar"
                    />
                </div>
            </div>

            {/* Pressure & Gas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Gas Mix</label>
                    <select
                        name="gasMix"
                        value={form.gasMix}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                    >
                        <option value="">Select gas mix</option>
                        <option value="air">Air</option>
                        <option value="ean32">EAN32</option>
                        <option value="ean36">EAN36</option>
                        <option value="ean40">EAN40</option>
                        <option value="customNitrox">Custom Nitrox</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Start Pressure</label>
                    <LabeledInputWithUnit
                        type="number"
                        name="startPressureBar"
                        value={form.startPressureBar}
                        onChange={handleChange}
                        placeholder="e.g., 200"
                        unit="bar"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">End Pressure</label>
                    <LabeledInputWithUnit
                        type="number"
                        name="endPressureBar"
                        value={form.endPressureBar}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        unit="bar"
                    />
                </div>
            </div>

            {usedPressure !== "" && (
                <p className="mt-2 text-gray-600">
                    <strong>Estimated Used:</strong> {usedPressure} bar
                </p>
            )}

            {/* Exposure Suit */}
            <h4 className="text-ocean-mid font-medium mt-4">Exposure Suit</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Suit Type</label>
                    <select
                        name="suitType"
                        value={form.suitType}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                    >
                        <option value="">Select suit type</option>
                        <option value="none">None</option>
                        <option value="shortie">Shortie</option>
                        <option value="full">Full Wetsuit</option>
                        <option value="drysuit">Drysuit</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {form.suitType !== "drysuit" && (
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700">Thickness</label>
                        <LabeledInputWithUnit
                            type="number"
                            name="thicknessMm"
                            value={form.thicknessMm}
                            onChange={handleChange}
                            placeholder="e.g., 3 / 5 / 7"
                            unit="mm"
                        />
                    </div>
                )}

                {form.suitType === "other" && (
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700">Suit Description</label>
                        <input
                            type="text"
                            name="suitOtherText"
                            value={form.suitOtherText}
                            onChange={handleChange}
                            placeholder="Describe suit"
                            className="w-full p-3 rounded border border-gray-300 focus:border-ocean-mid focus:ring-ocean-light"
                        />
                    </div>
                )}
            </div>

            {/* Weights */}
            <h4 className="text-ocean-mid font-medium mt-4">Weights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Weight</label>
                    <LabeledInputWithUnit
                        type="number"
                        name="weightKg"
                        value={form.weightKg}
                        onChange={handleChange}
                        placeholder="e.g., 6"
                        unit="kg"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700">Weight Type</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {weightOptions.map(option => {
                            const checked = form.weightType?.includes(option.value) || false;
                            return (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer ${checked
                                            ? "bg-ocean-mid text-white border-ocean-mid"
                                            : "bg-white border-gray-300 text-gray-700"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        checked={checked}
                                        onChange={() => {
                                            const newWeightTypes = checked
                                                ? form.weightType.filter(w => w !== option.value)
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