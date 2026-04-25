/**
 * @file geocode.js
 * @description Geocodes location name strings to lat/lng using the Nominatim API.
 * Free and requires no API key, but has a usage policy:
 *   - Max 1 request per second
 *   - Must include a descriptive User-Agent
 *   - Results are cached in-memory to avoid duplicate requests
 *
 * NOTE: Most Jotform submissions already include a `coordinates` field, so
 * this is only called as a fallback for location strings without coordinates.
 */

/** In-memory cache: locationString → { lat, lng } | null */
const geocodeCache = new Map();

/** Nominatim requires at least 1 second between requests */
const REQUEST_DELAY_MS = 1000;
let lastRequestTime = 0;

/**
 * Wait long enough to respect Nominatim's 1-request-per-second policy.
 * @returns {Promise<void>}
 */
async function respectRateLimit() {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < REQUEST_DELAY_MS) {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS - timeSinceLast));
  }
  lastRequestTime = Date.now();
}

/**
 * Geocode a location string to lat/lng coordinates using Nominatim.
 * Results are cached per unique location string for the lifetime of the page.
 *
 * @param {string} locationString - Location name, e.g. "Istanbul" or "Alsancak, Izmir"
 * @returns {Promise<{ lat: number, lng: number } | null>} Coordinates or null if not found
 */
export async function geocodeLocation(locationString) {
  if (!locationString || locationString.trim() === '') return null;

  const cacheKey = locationString.trim().toLowerCase();

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  await respectRateLimit();

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', locationString);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'FindPodo/1.0 (hackathon project; gulfem@lighteagle.org)',
      },
    });

    if (!response.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const results = await response.json();

    if (!results.length) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const coordinates = {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
    };

    geocodeCache.set(cacheKey, coordinates);
    return coordinates;
  } catch {
    geocodeCache.set(cacheKey, null);
    return null;
  }
}
