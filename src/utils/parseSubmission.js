/**
 * @file parseSubmission.js
 * @description Normalises raw Jotform submission objects into a clean EvidenceItem shape.
 *
 * RAW INPUT SHAPE (from /form/{id}/submissions):
 * {
 *   id: "6528489731008403623",
 *   form_id: "261133720555956",
 *   created_at: "2026-04-24 10:09:33",   // UTC string
 *   status: "ACTIVE",
 *   answers: {
 *     "3": { name: "location", text: "location", answer: "Alsancak Kordon" },
 *     "4": { name: "coordinates", text: "coordinates", answer: "38.4361,27.1436" },
 *     ...
 *   }
 * }
 *
 * NORMALISED OUTPUT SHAPE (EvidenceItem):
 * {
 *   id: "6528489731008403623",
 *   type: "sighting",
 *   submittedAt: Date,
 *   location: "Alsancak Kordon" | null,
 *   coordinates: { lat: 38.4361, lng: 27.1436 } | null,
 *   person: "Podo" | null,
 *   content: "Kısa sohbet; sonra ayrıldılar.",
 *   fields: { location: "Alsancak Kordon", coordinates: "38.4361,27.1436", ... },
 *   raw: { ...original submission object }
 * }
 *
 * Field-name mapping per form type (discovered via /questions endpoint):
 *   checkin:  fullname, location, coordinates, timestamp, note
 *   sighting: personname, seenwith, location, coordinates, timestamp, note
 *   message:  from, to, message, timestamp  (no location/coordinates)
 *   note:     fullname, note, timestamp     (no location/coordinates)
 *   tip:      suspectname, location, coordinates, timestamp, tip, confidence
 */

/**
 * Return true if a location string looks like real data.
 * Rejects single-character noise ("d", "s") and the known garbage values
 * submitted by test users ("dd", "ss", etc.) by requiring at least 3 chars.
 *
 * @param {string | null | undefined} locationString
 * @returns {boolean}
 */
function isValidLocation(locationString) {
  if (!locationString) return false;
  return locationString.trim().length >= 3;
}

/**
 * Extract a flat key→value map from a raw submission's `answers` object.
 * Skips heading and button fields (answer is undefined or empty string).
 *
 * @param {Record<string, { name: string, answer: unknown }>} answers - Raw answers object
 * @returns {Record<string, string>} Flat map of field name → string value
 */
function extractFields(answers) {
  const fields = {};
  for (const answer of Object.values(answers)) {
    if (answer.answer === undefined || answer.answer === null || answer.answer === '') continue;
    fields[answer.name] = String(answer.answer).trim();
  }
  return fields;
}

/**
 * Parse a "lat,lng" coordinate string into a { lat, lng } object.
 * Returns null if the string is missing, malformed, or contains non-numeric values.
 *
 * @param {string | undefined} coordinateString - e.g. "38.4361,27.1436"
 * @returns {{ lat: number, lng: number } | null}
 */
function parseCoordinates(coordinateString) {
  if (!coordinateString) return null;

  const parts = coordinateString.split(',');
  if (parts.length !== 2) return null;

  const lat = parseFloat(parts[0].trim());
  const lng = parseFloat(parts[1].trim());

  if (isNaN(lat) || isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

/**
 * Pick the most human-readable "person" name from the fields,
 * depending on which form type the submission came from.
 *
 * @param {string} type - Evidence type key
 * @param {Record<string, string>} fields - Parsed fields map
 * @returns {string | null}
 */
function extractPerson(type, fields) {
  switch (type) {
    case 'checkin':  return fields.fullname  ?? null;
    case 'sighting': return fields.personname ?? null;
    case 'message':  return fields.from      ?? null;
    case 'note':     return fields.fullname  ?? null;
    case 'tip':      return fields.suspectname ?? null;
    default:         return null;
  }
}

/**
 * Pick the primary readable content snippet from the fields.
 *
 * @param {string} type - Evidence type key
 * @param {Record<string, string>} fields - Parsed fields map
 * @returns {string}
 */
function extractContent(type, fields) {
  switch (type) {
    case 'checkin':  return fields.note     ?? fields.location ?? '';
    case 'sighting': return fields.note     ?? fields.location ?? '';
    case 'message':  return fields.message  ?? '';
    case 'note':     return fields.note     ?? '';
    case 'tip':      return fields.tip      ?? '';
    default:         return '';
  }
}

/**
 * Normalise a single raw Jotform submission into a clean EvidenceItem.
 *
 * @param {object} rawSubmission - Raw submission object from the Jotform API
 * @param {string} type - Evidence type key ('checkin' | 'sighting' | 'message' | 'note' | 'tip')
 * @returns {EvidenceItem} Normalised evidence item
 */
export function parseSubmission(rawSubmission, type) {
  const fields = extractFields(rawSubmission.answers ?? {});

  return {
    id: String(rawSubmission.id),
    type,
    submittedAt: new Date(rawSubmission.created_at),
    location: isValidLocation(fields.location) ? fields.location : null,
    coordinates: parseCoordinates(fields.coordinates),
    person: extractPerson(type, fields),
    content: extractContent(type, fields),
    fields,
    raw: rawSubmission,
  };
}

/**
 * Normalise an array of raw submissions of the same type.
 *
 * @param {object[]} rawSubmissions - Array of raw Jotform submission objects
 * @param {string} type - Evidence type key
 * @returns {EvidenceItem[]} Array of normalised evidence items
 */
export function parseSubmissions(rawSubmissions, type) {
  if (!Array.isArray(rawSubmissions)) return [];
  return rawSubmissions.map((raw) => parseSubmission(raw, type));
}
