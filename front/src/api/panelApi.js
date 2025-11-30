const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}` || "http://localhost:5000/api/god";

export async function getAllowedFilters(panel) {
  const res = await fetch(`${BASE_URL}/panel/${panel}/filters`);
  return res.json();
}

export async function getQueryBasedData(query) {
  const res = await fetch(`${BASE_URL}/users?${query}`);
  return res.json();
}
