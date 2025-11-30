import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import { useAuthContext } from "../hooks/useAuthContext";
import { useDiveContext } from "../hooks/useDiveContext";
import { useUnitContext } from "../hooks/useUnitContext";

import { feetToMeters, fToC, lbsToKg, psiToBar, metersToFeet, cToF, kgToLbs, barToPsi, format1 } from '../utils/unitConversions'
import { apiFetch } from '../utils/api';

import CoreDetails from "../components/LogDiveSteps/CoreDetails";
import DiveConditions from "../components/LogDiveSteps/DiveConditions";
import EquipmentAndAir from "../components/LogDiveSteps/EquipmentAndAir";
import MiscData from "../components/LogDiveSteps/MiscData";
import ReviewDive from "../components/LogDiveSteps/ReviewDive";

const LogDive = ({ dive: initialDive }) => {
    const { diveId } = useParams();
    const location = useLocation();

    const [dive, setDive] = useState(location.state?.dive || initialDive || null);

    const { user, dispatch: authDispatch } = useAuthContext();
    const { dispatch: diveDispatch } = useDiveContext();
    const { unitSystem } = useUnitContext();

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [missingFields, setMissingFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [form, setForm] = useState(() =>
        dive ? prefillDiveForm(dive, unitSystem) : getEmptyForm(unitSystem)
    );

    const StepComponent = steps[currentStep];

    useEffect(() => {
        if (diveId && !dive) {
            // fetch the dive if not passed via state
            const fetchDive = async () => {
                try {
                    const res = await apiFetch(`/api/dives/${diveId}`);
                    if (res.ok) {
                        const json = await res.json();
                        setDive(json);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchDive();
        }
    }, [diveId, dive]);

    const isEdit = Boolean(dive);

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

        const usesImperial = unitSystem === "imperial";

        // Numeric conversions
        // Depth
        const maxDepthMeters = form.maxDepthMeters
            ? (usesImperial ? feetToMeters(Number(form.maxDepthMeters)) : Number(form.maxDepthMeters))
            : null;

        const avgDepthMeters = form.avgDepthMeters
            ? (usesImperial ? feetToMeters(Number(form.avgDepthMeters)) : Number(form.avgDepthMeters))
            : null;

        // Visibility
        const visibilityMeters = form.visibilityMeters
            ? (usesImperial ? feetToMeters(Number(form.visibilityMeters)) : Number(form.visibilityMeters))
            : null;

        // Temperatures
        const waterTempC = form.waterTempC
            ? (usesImperial ? fToC(Number(form.waterTempC)) : Number(form.waterTempC))
            : null;

        const airTempC = form.airTempC
            ? (usesImperial ? fToC(Number(form.airTempC)) : Number(form.airTempC))
            : null;

        // Weight
        const weightKg = form.weightKg
            ? (usesImperial ? lbsToKg(Number(form.weightKg)) : Number(form.weightKg))
            : null;

        // Pressure
        const startPressureBar = form.startPressureBar
            ? (usesImperial ? psiToBar(Number(form.startPressureBar)) : Number(form.startPressureBar))
            : null;

        const endPressureBar = form.endPressureBar
            ? (usesImperial ? psiToBar(Number(form.endPressureBar)) : Number(form.endPressureBar))
            : null;

        // Build request body
        const body = {
            title: form.title,
            diveSite: form.diveSite,
            date: form.date,

            maxDepthMeters,
            avgDepthMeters,
            bottomTimeMinutes: Number(form.bottomTimeMinutes) || null,

            visibilityMeters,
            waterTempC,
            airTempC,

            entryType: form.entryType,
            surge: form.surge,
            current: form.current,

            tank: {
                tankLabel: form.tankLabel || null,
                customSpecs: form.tankLabel === "Other" ? form.customSpecs : null,
                gasMix: form.gasMix || null,
            },

            pressure:
                startPressureBar !== null && endPressureBar !== null
                    ? { startPressureBar, endPressureBar }
                    : null,

            exposureSuit: form.suitType
                ? {
                    type: form.suitType,
                    thicknessMm: Number(form.thicknessMm) || null,
                    otherText: form.suitType === "other" ? form.suitOtherText : null,
                }
                : null,

            weight: weightKg !== null
                ? {
                    weightKg,
                    weightType: form.weightType || [],
                }
                : null,

            rating: form.rating,
            lifeSeen: form.lifeSeen.filter((item) => item.active),
            additionalNotes: form.additionalNotes || "",
        };

        try {
            const response = await apiFetch(
                isEdit ? `/api/dives/${dive._id}` : "/api/dives",
                {
                    method: isEdit ? "PATCH" : "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                },
                authDispatch
            );

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || "Failed to submit.");
                setIsLoading(false);
                setShowErrorModal(true);
                return;
            } else {
                diveDispatch({ type: isEdit ? "UPDATE_DIVE" : "CREATE_DIVE", payload: json });

                if (!isEdit) {
                    setForm(getEmptyForm(unitSystem));
                    setCurrentStep(0);
                }

                setIsLoading(false);
                setShowSuccessModal(true);
            }
        } catch (err) {
            console.error(err);
            setError("A network or server error occurred.");
            setIsLoading(false);  
            setShowErrorModal(true);

        }
    };

    return (
        <div className="flex flex-col gap-6 w-full min-h-screen bg-sand-light py-8">
            <div className="max-w-4xl w-full mx-auto">

                {/* Step Wrapper */}
                <StepComponent
                    form={form}
                    handleChange={handleChange}
                    onEdit={handleBack}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    missingFields={missingFields}
                    isEdit={isEdit} 
                />

                {/* Error Validation Message */}
                {error && <div className="max-w-3xl mx-auto text-red-500 font-medium mt-5">{error}</div>}

                {/* Buttons */}
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
                            {isLoading ? (isEdit ? "Updating..." : "Logging...")
                                : (isEdit ? "Update Dive" : "Confirm & Log Dive")}
                        </button>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center animate-fadeIn">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Dive Successfully {isEdit ? "Updated" : "Logged"}!
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            You can now return to your dashboard.
                        </p>
                        <div className="flex justify-center gap-3 mt-6">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Close
                            </button>
                            <Link
                                to="/"
                                className="px-4 py-2 rounded bg-ocean-mid text-white hover:bg-ocean-deep"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
                        <h2 className="text-lg font-semibold text-red-600">
                            {isEdit ? "Update Failed" : "Submission Failed"}
                        </h2>

                        <p className="text-sm text-gray-700 mt-2">
                            {error || "An unexpected error occurred."}
                        </p>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );

};

export default LogDive;

const steps = [
    CoreDetails,
    DiveConditions,
    EquipmentAndAir,
    MiscData,
    ReviewDive,
];

const getEmptyForm = (unitSystem) => ({
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
    tankLabel: "",
    customSpecs: "",
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
    unitSystem,
});

const prefillDiveForm = (dive, unitSystem) => {
    const usesImperial = unitSystem === "imperial";

    return {
        title: dive.title || "",
        diveSite: dive.diveSite || "",
        date: dive.date?.split("T")[0] || "",

        maxDepthMeters: dive.maxDepthMeters
            ? usesImperial
                ? format1(metersToFeet(dive.maxDepthMeters))
                : format1(dive.maxDepthMeters)
            : "",

        avgDepthMeters: dive.avgDepthMeters
            ? usesImperial
                ? format1(metersToFeet(dive.avgDepthMeters))
                : format1(dive.avgDepthMeters)
            : "",

        bottomTimeMinutes: dive.bottomTimeMinutes || "",
        entryType: dive.entryType || "",

        visibilityMeters: dive.visibilityMeters
            ? usesImperial
                ? format1(metersToFeet(dive.visibilityMeters))
                : format1(dive.visibilityMeters)
            : "",

        waterTempC: dive.waterTempC
            ? usesImperial
                ? format1(cToF(dive.waterTempC))
                : format1(dive.waterTempC)
            : "",

        airTempC: dive.airTempC
            ? usesImperial
                ? format1(cToF(dive.airTempC))
                : format1(dive.airTempC)
            : "",

        surge: dive.surge || "none",
        current: dive.current || "none",

        tankLabel: dive.tank?.tankLabel || "",
        customSpecs: dive.tank?.customSpecs || "",
        gasMix: dive.tank?.gasMix || "",

        startPressureBar: dive.pressure?.startPressureBar
            ? usesImperial
                ? format1(barToPsi(dive.pressure.startPressureBar))
                : format1(dive.pressure.startPressureBar)
            : "",

        endPressureBar: dive.pressure?.endPressureBar
            ? usesImperial
                ? format1(barToPsi(dive.pressure.endPressureBar))
                : format1(dive.pressure.endPressureBar)
            : "",

        suitType: dive.exposureSuit?.type || "",
        thicknessMm: dive.exposureSuit?.thicknessMm || "",
        suitOtherText: dive.exposureSuit?.otherText || "",

        weightKg: dive.weight?.weightKg
            ? usesImperial
                ? format1(kgToLbs(dive.weight.weightKg))
                : format1(dive.weight.weightKg)
            : "",

        weightType: dive.weight?.weightType || [],
        rating: dive.rating || 3,

        lifeSeen: (dive.lifeSeen || []).map(item => ({
            group: item.group,
            detail: item.detail || "",
            active: true
        })),

        additionalNotes: dive.additionalNotes || "",
        unitSystem,
    };
};

