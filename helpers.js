
export const CHECK_FIELDS = [
  "food_from_approved_source", "food_protected_from", "ill_workers_restricted",
  "proper_hand_washing", "cooling_time_and_temperature", "cold_holding_temperature",
  "hot_holding_temperature", "cooking_time_and_temperature",
  "reheating_time_and_temperature", "hot_and_cold_running_water",
  "proper_sewage_disposal", "no_bare_hand_contact", "adequate_hand_washing",
  "rodent_and_insects", "food_contact_surfaces_and",
];

// for "------", "N/A" into "Not listed"
export function clean(value) {
  if (value === undefined || value === null) return "Not listed";
  const text = String(value).trim();
  return text === "" || text === "------" || text === "N/A" ? "Not listed" : text;
}


export function safe(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// format places
export function cityName(value) {
  const text = clean(value);
  if (text === "Not listed") return text;
  return safe(text.toLowerCase().replace(/(^|[\s-])\w/g, (c) => c.toUpperCase()));
}

// date formtting
export function formatDate(iso) {
  if (clean(iso) === "Not listed") return "Not listed";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// counting how many "out of compliance"s there are
export function countFailed(inspection) {
  return CHECK_FIELDS.filter((f) => inspection[f] === "Out of Compliance").length;
}

// fromatting labels
export function checkLabel(field) {
  if (field === "food_contact_surfaces_and") return "Food contact surfaces";
  const text = field.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}