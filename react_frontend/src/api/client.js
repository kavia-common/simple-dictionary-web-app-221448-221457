/**
 * API client for the dictionary service.
 * Reads REACT_APP_API_BASE or defaults to https://api.dictionaryapi.dev/api/v2
 */

const DEFAULT_BASE = 'https://api.dictionaryapi.dev/api/v2';

const base = (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim())
  ? process.env.REACT_APP_API_BASE.trim().replace(/\/+$/, '')
  : DEFAULT_BASE;

/**
 * INTERNAL: builds URL to /entries/en/<word>
 */
function entriesUrl(word) {
  // The public API path: /entries/<lang>/<word>
  const lang = 'en';
  return `${base}/entries/${lang}/${encodeURIComponent(word)}`;
}

// PUBLIC_INTERFACE
export async function fetchDefinitions(word) {
  /** Fetch definitions for a word from the external API.
   * Returns an array of entries when success.
   * Throws an Error with a friendly message when not found or network error.
   */
  const res = await fetch(entriesUrl(word), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    let msg = 'Failed to fetch definitions.';
    try {
      const data = await res.json();
      if (Array.isArray(data) && data.length === 0) {
        msg = 'No definitions found.';
      } else if (data && (data.title || data.message)) {
        msg = data.message || data.title || msg;
      }
    } catch {
      // ignore parse errors, keep default msg
    }
    throw new Error(msg);
  }

  // Public API returns JSON array of entries
  const data = await res.json();
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error('No definitions found.');
  }
  return data;
}
