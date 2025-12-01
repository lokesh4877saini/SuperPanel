// -------------------- BASE URL (safe setup) --------------------
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// remove any trailing slash (prevents //panel/... issues)
const BASE_URL = API_BASE.replace(/\/+$/, "");

// helper to build panel routes
const panelRoute = (panel) => `${BASE_URL}/panel/${panel}`;


// -------------------- GET ALLOWED FILTERS --------------------
export async function getAllowedFilters(panel) {
  const res = await fetch(`${panelRoute(panel)}/filters`);

  if (!res.ok) throw new Error(`Failed to load filters for panel: ${panel}`);
  return res.json();
}


// -------------------- GET QUERY BASED USER DATA --------------------
export async function getQueryBasedData(query) {
  const res = await fetch(`${BASE_URL}/users?${query}`);

  if (!res.ok) throw new Error(`Failed query: ${query}`);
  return res.json();
}
