/**
 * @file jotformClient.js
 * @description Base HTTP wrapper for the Jotform REST API.
 *
 * NOTE ON AUTH: The spec called for APIKEY header auth, but Jotform's CORS policy
 * only allows: Content-Type, jf-trace-parent-id, x-mcp-token.
 * The APIKEY header triggers a preflight that Jotform rejects — every browser
 * fetch silently fails. We use the ?apiKey query param instead, which avoids
 * the CORS preflight. The key is in the JS bundle either way for a frontend app.
 */

const BASE_URL = 'https://api.jotform.com';

/**
 * Perform a GET request against the Jotform API.
 *
 * @param {string} endpoint - Path after the base URL, e.g. "/form/123/submissions"
 * @param {Record<string, string | number>} [params={}] - Additional query string parameters
 * @returns {Promise<unknown>} The `content` field from the Jotform response envelope
 * @throws {Error} On missing API key, HTTP error, or non-200 Jotform response code
 */
export async function jotformGet(endpoint, params = {}) {
  const apiKey = import.meta.env.VITE_JOTFORM_API_KEY;

  if (!apiKey) {
    throw new Error(
      'VITE_JOTFORM_API_KEY is not defined. Add it to your .env file and restart the dev server.'
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  // apiKey goes first so it's easy to see in network tab during debugging
  url.searchParams.set('apiKey', apiKey);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Jotform HTTP error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.responseCode !== 200) {
    throw new Error(`Jotform API error [${json.responseCode}]: ${json.message}`);
  }

  return json.content;
}
