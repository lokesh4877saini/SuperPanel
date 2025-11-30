// src/api/godApi.js
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/god` || "http://localhost:5000/api/god";

// -------------------- FILTERS --------------------
export async function createFilter(filterData) {
  const res = await fetch(`${BASE_URL}/addfilter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filterData),
  });
  return res.json();
}

export async function getAllFilters() {
  const res = await fetch(`${BASE_URL}/allfilter`);
  return res.json();
}

export async function deleteFilter(id) {
  const res = await fetch(`${BASE_URL}/deletefilter/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function updateFilter(id, updatedData) {
  const res = await fetch(`${BASE_URL}/updatefilter/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return res.json();
}

// -------------------- SEARCHABLE FIELDS --------------------
// Get fields with panel-specific searchable status
export async function getSeachableFields(panel) {
  const res = await fetch(`${BASE_URL}/searchable-fields?panel=${panel}`);
  return res.json();
}

// Update searchable field for a specific panel
export async function updateSeachableFields(id, updated, panel) {
  const res = await fetch(`${BASE_URL}/searchable-fields/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isSearchable: updated,
      panel: panel 
    })
  });
  return res.json();
}

// Seed missing fields (no panel involved)
export async function seedSearchableFields() {
  const res = await fetch(`${BASE_URL}/searchable-fields/seed`);
  return res.json();
}

// -------------------- PANEL & FILTER UTILITIES --------------------
export async function getAllPossibleFields() {
  const res = await fetch(`${BASE_URL}/possible-fields`);
  return res.json();
}

export async function getDistinctFieldValue(fieldPath) {
  const res = await fetch(`${BASE_URL}/distinct-values?fieldPath=${encodeURIComponent(fieldPath)}`);
  return res.json();
}

export async function getPanelFilters(panel) {
  const res = await fetch(`${BASE_URL.replace("/god", "")}/panel/${panel}/filters`);
  return res.json();
}

export async function updatePanelFilters(panel, allowedFilters) {
  const res = await fetch(`${BASE_URL.replace("/god", "")}/panel/${panel}/filters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allowedFilters })
  });
  return res.json();
}
