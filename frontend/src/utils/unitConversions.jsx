export const format1 = (num) => Number(num.toFixed(1));

export const metersToFeet = (m) => format1(m * 3.28084);
export const feetToMeters = (ft) => format1(ft / 3.28084);

export const cToF = (c) => format1((c * 9) / 5 + 32);
export const fToC = (f) => format1(((f - 32) * 5) / 9);

export const kgToLbs = (kg) => format1(kg * 2.20462);
export const lbsToKg = (lbs) => format1(lbs / 2.20462);

export const barToPsi = (bar) => format1(bar * 14.5038);
export const psiToBar = (psi) => format1(psi / 14.5038);

export const formatTime12h = (time24) => {
    if (!time24) return "";

    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert military time to 12hr
    return `${hour}:${minute} ${ampm}`;
};

export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const monthName = new Date(0, month - 1).toLocaleString("en-US", { month: "long" });
    return `${monthName} ${parseInt(day)}, ${year}`;
};