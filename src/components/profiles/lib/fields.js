/** Resolve any display/editable field key against the user profile object. */
export function resolveFieldValue(user, key) {
  const nested = user.profile ?? {};
  switch (key) {
    case "organization":
      return nested.organization;
    case "designation":
      return nested.designation;
    case "responder_type":
      return nested.responder_type;
    case "availability_status":
      return nested.availability_status;
    case "administrative_area":
      return nested.administrative_area;
    case "administrative_areas":
      return nested.administrative_areas;
    default:
      return user[key];
  }
}

/** Administrative area counts as filled when at least the division or district exists. */
function areaIsEmpty(area) {
  if (!area) return true;
  return !area.division && !area.district && !area.upazila && !area.union;
}
export function isFieldEmpty(key, value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (key === "administrative_area") return areaIsEmpty(value);
  return false;
}

/** Leaf label for an area assignment, e.g. কয়রা → "কয়রা", whole district → "খুলনা" */
export function areaLeafName(area) {
  return area.union ?? area.upazila ?? area.district ?? area.division ?? "";
}

/** Full path parts of an administrative area. */
export function areaPath(area) {
  return [area.division, area.district, area.upazila, area.union].filter(
    (part) => Boolean(part && part.trim()),
  );
}
