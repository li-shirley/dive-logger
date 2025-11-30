export const format1 = (num) => Number(num.toFixed(1));

export const metersToFeet = (m) => format1(m * 3.28084);
export const feetToMeters = (ft) => format1(ft / 3.28084);

export const cToF = (c) => format1((c * 9) / 5 + 32);
export const fToC = (f) => format1(((f - 32) * 5) / 9);

export const kgToLbs = (kg) => format1(kg * 2.20462);
export const lbsToKg = (lbs) => format1(lbs / 2.20462);

export const barToPsi = (bar) => format1(bar * 14.5038);
export const psiToBar = (psi) => format1(psi / 14.5038);
