// src/api/godApi.js

// safe read of env var (Vite inlines these at build time)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ensure no trailing slash on API_BASE
const API_BASE_CLEAN = API_BASE.replace(/\/+$/, "");

// god base
export const BASE_URL = `${API_BASE_CLEAN}/god`;

// helper to build panel routes (avoids using replace on unexpected strings)
const panelBase = (panel) => `${API_BASE_CLEAN}/panel/${panel}`;

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    // optional: throw for non-2xx so caller can handle
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
  } catch (err) {
    // you can console.error or rethrow
    console.error("Fetch error:", url, err);
    throw err;
  }
}

// -------------------- FILTERS --------------------
export async function createFilter(filterData) {
  return safeFetch(`${BASE_URL}/addfilter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filterData),
  });
}

export async function getAllFilters() {
  return safeFetch(`${BASE_URL}/allfilter`);
}

export async function deleteFilter(id) {
  return safeFetch(`${BASE_URL}/deletefilter/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateFilter(id, updatedData) {
  return safeFetch(`${BASE_URL}/updatefilter/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
}

// -------------------- SEARCHABLE FIELDS --------------------
export async function getSeachableFields(panel) {
  return safeFetch(`${BASE_URL}/searchable-fields?panel=${encodeURIComponent(panel)}`);
}

export async function updateSeachableFields(id, updated, panel) {
  return safeFetch(`${BASE_URL}/searchable-fields/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isSearchable: updated, panel }),
  });
}

export async function seedSearchableFields() {
  return safeFetch(`${BASE_URL}/searchable-fields/seed`);
}

// -------------------- PANEL & FILTER UTILITIES --------------------
export async function getAllPossibleFields() {
  return safeFetch(`${BASE_URL}/possible-fields`);
}

export async function getDistinctFieldValue(fieldPath) {
  return safeFetch(`${BASE_URL}/distinct-values?fieldPath=${encodeURIComponent(fieldPath)}`);
}

export async function getPanelFilters(panel) {
  return safeFetch(`${panelBase(panel)}/filters`);
}

export async function updatePanelFilters(panel, allowedFilters) {
  return safeFetch(`${panelBase(panel)}/filters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allowedFilters }),
  });
}
