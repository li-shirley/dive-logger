const LBS_TO_KG = 0.45359237;
const PSI_TO_BAR = 0.0689475729;
const FEET_TO_M = 0.3048;

// todo: use for toggling between metric/imperial units
function toKg(value, unit) {
    if (value == null) return null;
    return unit === "lbs" ? value * LBS_TO_KG : value;
}
function toBar(value, unit) {
    if (value == null) return null;
    return unit === "psi" ? value * PSI_TO_BAR : value;
}
function toMeters(value, unit) {
    if (value == null) return null;
    return unit === "ft" ? value * FEET_TO_M : value;
}
module.exports = { toKg, toBar, toMeters };
