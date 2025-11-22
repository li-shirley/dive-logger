import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDiveContext } from "../hooks/useDiveContext";
import { apiFetch } from '../utils/api';

import CoreDetails from "../components/LogDiveSteps/CoreDetails";
import DiveConditions from "../components/LogDiveSteps/DiveConditions";
import EquipmentAndAir from "../components/LogDiveSteps/EquipmentAndAir";
import MiscData from "../components/LogDiveSteps/MiscData";
import ReviewDive from "../components/LogDiveSteps/ReviewDive";

const steps = [
    CoreDetails,
    DiveConditions,
    EquipmentAndAir,
    MiscData,
    ReviewDive,
];

const LogDive = () => {
    const { user, dispatch: authDispatch } = useAuthContext();
    const { dispatch: diveDispatch } = useDiveContext();

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [missingFields, setMissingFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        diveSite: "",
        date: "",
        maxDepthMeters: "",
        avgDepthMeters: "",
        bottomTimeMinutes: "",
        entryType: "",
        visibilityMeters: "",
        waterTempC: "",
        airTempC: "",
        surge: "none",
        current: "none",
        tankType: "",
        internalVolumeLiters: "",
        ratedPressureBar: "",
        gasMix: "",
        startPressureBar: "",
        endPressureBar: "",
        suitType: "",
        thicknessMm: "",
        suitOtherText: "",
        weightKg: "",
        weightType: [],
        rating: 3,
        lifeSeen: [],
        additionalNotes: "",
    });

    const StepComponent = steps[currentStep];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "date") {
            const today = new Date().toISOString().split("T")[0];
            if (value > today) {
                setForm(prev => ({ ...prev, date: today }));
                return;
            }
        }

        setForm(prev => ({
            ...prev,
            [name]: typeof value === "string" ? value.replace(/^\s+/, "") : value
        }));
    };

    const requiredFields = [
        "title",
        "diveSite",
        "date",
        "maxDepthMeters",
        "bottomTimeMinutes",
        "entryType",
    ];

    const fieldLabels = {
        title: "Dive Title",
        diveSite: "Dive Site",
        date: "Date",
        maxDepthMeters: "Max Depth",
        bottomTimeMinutes: "Bottom Time",
        entryType: "Entry Type",
    };

    const handleNext = () => {
        if (currentStep === 0) {
            const missing = requiredFields.filter(field => !form[field]);
            if (missing.length > 0) {
                setMissingFields(missing);
                setError(`Please fill in: ${missing.map(f => fieldLabels[f]).join(", ")}`);
                return;
            }
        }

        setError(null);
        setMissingFields([]);
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async () => {
        if (!user) {
            setError("You must be logged in");
            return;
        }

        setIsLoading(true);
        setError(null);

        const body = {
            title: form.title,
            diveSite: form.diveSite,
            date: form.date,
            maxDepthMeters: form.maxDepthMeters,
            avgDepthMeters: form.avgDepthMeters,
            bottomTimeMinutes: form.bottomTimeMinutes,
            visibilityMeters: form.visibilityMeters || null,
            waterTempC: form.waterTempC || null,
            airTempC: form.airTempC || null,
            entryType: form.entryType,
            surge: form.surge,
            current: form.current,
            tank: {
                tankType: form.tankType || null,
                internalVolumeLiters: Number(form.internalVolumeLiters) || null,
                ratedPressureBar: Number(form.ratedPressureBar) || null,
                gasMix: form.gasMix || null,
            },
            pressure:
                form.startPressureBar !== "" && form.endPressureBar !== ""
                    ? {
                        startPressureBar: Number(form.startPressureBar),
                        endPressureBar: Number(form.endPressureBar),
                    }
                    : null,
            exposureSuit: form.suitType
                ? {
                    type: form.suitType,
                    thicknessMm: Number(form.thicknessMm) || null,
                    otherText: form.suitType === "other" ? form.suitOtherText : null,
                }
                : null,
            weight: form.weightKg
                ? {
                    weightKg: Number(form.weightKg) || null,
                    weightType: form.weightType || null,
                }
                : null,
            rating: form.rating,
            lifeSeen: form.lifeSeen.filter(item => item.active),
            additionalNotes: form.additionalNotes || "",
        };

        try {
            const response = await apiFetch("/api/dives", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }, authDispatch);

            if (!response) return;

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                diveDispatch({ type: "CREATE_DIVE", payload: json });
                setForm({
                    title: "", diveSite: "", date: "", maxDepthMeters: "", avgDepthMeters: "",
                    bottomTimeMinutes: "", entryType: "", visibilityMeters: "", waterTempC: "",
                    airTempC: "", surge: "none", current: "none", tankType: "", internalVolumeLiters: "",
                    ratedPressureBar: "", gasMix: "", startPressureBar: "", endPressureBar: "",
                    suitType: "", thicknessMm: "", suitOtherText: "", weightKg: "", weightType: [],
                    rating: 3, lifeSeen: [], additionalNotes: ""
                });
                setCurrentStep(0);
            }
        } catch (err) {
            console.log(err);
            setError("Failed to log dive");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-sand-light py-8">
            <div className="max-w-4xl w-full mx-auto">
                <StepComponent
                    form={form}
                    handleChange={handleChange}
                    onEdit={handleBack}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    missingFields={missingFields}
                />

                {error && <div className="max-w-3xl mx-auto text-red-500 font-medium mt-2">{error}</div>}

                <div className="flex justify-between mt-6 max-w-3xl mx-auto">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="bg-sand-mid text-ocean-deep px-5 py-2 rounded shadow hover:bg-sand-light disabled:opacity-50 transition-all"
                    >
                        Back
                    </button>

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="bg-ocean-mid text-sand-light px-5 py-2 rounded shadow hover:bg-ocean-deep transition-all"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-ocean-mid text-sand-light px-5 py-2 rounded shadow hover:bg-ocean-deep disabled:opacity-50 transition-all"
                        >
                            {isLoading ? "Logging..." : "Confirm & Log Dive"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

};

export default LogDive;
