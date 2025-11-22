const MiscData = ({ form, handleChange }) => {
    const lifeOptions = [
        "Turtle",
        "Ray",
        "Shark",
        "Eel",
        "Nudibranch",
        "Crustacean",
        "Cephalopod",
        "Reef Fish",
        "Schooling Fish",
        "Seahorse / Pipefish",
        "Dolphin / Whale",
        "Coral / Sponge",
        "Other",
    ];

    const updateLifeSeenDetail = (group, detail) => {
        const updated = form.lifeSeen.map((item) =>
            item.group === group ? { ...item, detail } : item
        );
        handleChange({ target: { name: "lifeSeen", value: updated } });
    };

    const toggleLifeSeen = (group, checked) => {
        const updated = [...form.lifeSeen];
        const existing = updated.find(item => item.group === group);

        if (checked) {
            if (existing) existing.active = true;
            else updated.push({ group, detail: "", active: true });
        } else {
            if (existing) existing.active = false;
        }

        handleChange({ target: { name: "lifeSeen", value: updated } });
    };

    return (
        <div className="step w-full max-w-3xl mx-auto flex flex-col gap-6 bg-sand-light p-6 rounded-xl shadow-md">
            <h3 className="text-ocean-deep text-xl font-semibold">Additional Dive Data</h3>

            {/* Rating Stars */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Rate Your Dive:</label>
                <div className="flex gap-2 text-2xl cursor-pointer select-none">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`transition-colors ${star <= form.rating ? 'text-ocean-mid' : 'text-gray-300'}`}
                            onClick={() =>
                                handleChange({ target: { name: "rating", value: star } })
                            }
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            {/* Life Seen */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Life Seen:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {lifeOptions.map((group) => {
                        const itemData = form.lifeSeen.find((item) => item.group === group);
                        const selected = itemData?.active;

                        return (
                            <div key={group} className="flex flex-col gap-2">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected || false}
                                        onChange={(e) => toggleLifeSeen(group, e.target.checked)}
                                        className="accent-ocean-mid"
                                    />
                                    <span className="text-gray-800">{group}</span>
                                </label>

                                {selected && (
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded focus:border-ocean-mid focus:ring-ocean-light resize-vertical"
                                        placeholder="Details (optional)"
                                        value={itemData?.detail || ""}
                                        onChange={(e) => updateLifeSeenDetail(group, e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Additional Notes */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Additional Dive Notes</label>
                <textarea
                    name="additionalNotes"
                    value={form.additionalNotes}
                    onChange={handleChange}
                    placeholder="Any additional dive notes or observations..."
                    className="w-full p-3 border border-gray-300 rounded focus:border-ocean-mid focus:ring-ocean-light resize-vertical"
                    rows={4}
                />
            </div>
        </div>
    );
};

export default MiscData;