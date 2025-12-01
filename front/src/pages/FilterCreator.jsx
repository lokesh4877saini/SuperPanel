import { useEffect, useState } from "react";
import {
  createFilter,
  getAllFilters,
  deleteFilter,
  getAllPossibleFields,
  getDistinctFieldValue
} from "../api/godApi";
import { fieldMap } from "../utils/fieldMap";

export default function FilterCreator({ reloadFilters, setFilters }) {
  const [possibleFields, setPossibleFields] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    label: "",
    fieldPath: "",
    filterType: "",
    options: [] // store enum values as array
  });

  // Load possible fields + existing filters
  useEffect(() => {
    getAllPossibleFields().then(setPossibleFields);
    getAllFilters().then(setFilterList);
  }, []);

  // When fieldPath changes, fetch distinct values
  useEffect(() => {
    if (!form.fieldPath) return;

    getDistinctFieldValue(form.fieldPath).then(values => {
      setForm(prev => ({ ...prev, options: values }));
    });
  }, [form.fieldPath]);

  const handleFieldChange = (fieldPath) => {
    const parts = fieldPath.split(".");
    const catId = Object.keys(fieldMap).find(k => fieldMap[k] === fieldPath) || parts.join("_");
    const defaultLabel = parts[parts.length - 1].replace("_", " ").toUpperCase();

    setForm(prev => ({
      ...prev,
      fieldPath,
      categoryId: catId,
      label: prev.label || defaultLabel,
      options: [] // reset until distinct values fetched
    }));

    getDistinctFieldValue(fieldPath).then(values => {
      setForm(prev => ({ ...prev, options: values }));
    });
  };

  // Remove a single enum value before submit
  const handleRemoveOption = (val) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.filter(o => o !== val)
    }));
  };

  const handleCreateFilter = async (e) => {
    e.preventDefault();
    if (!form.fieldPath || !form.filterType) return alert("Please select field and filter type");

    // Only send the remaining enum values
    const payload = {
      ...form,
      options: form.filterType === "enum" ? form.options : []
    };

    const createdFilter = await createFilter(payload);

    setFilters(prev => [...prev, createdFilter]);
    setFilterList(prev => [...prev, createdFilter]);

    // Reset form
    setForm({ categoryId: "", label: "", fieldPath: "", filterType: "", options: [] });
  };

  // --- STYLES ---
  const styles = {
    container: { padding: 25, background: "#f5f7fa", borderRadius: 12, maxWidth: 650, margin: "auto" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" },
    form: { display: "flex", flexDirection: "column", gap: 12 },
    input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", outline: "none", fontSize: 14, width: "100%" },
    inputLable:{ padding: "10px 12px", borderRadius: 8, border: "1px solid #dddd", outline: "none", fontSize: 14, width: "96%" },
    button: { padding: "10px 15px", borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer", fontWeight: "bold" },
    optionChip: { display: "inline-flex", gap: 6, alignItems: "center", padding: "4px 10px", borderRadius: 8, background: "#ffe4d6", border: "1px solid #fcbf91", fontSize: 13 },
    removeBtn: { cursor: "pointer", fontWeight: "bold", color: "#ef4444" },
    filterCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 8 }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create / Edit Filter</h2>
      <form onSubmit={handleCreateFilter} style={styles.form}>
        <select value={form.fieldPath} onChange={(e) => handleFieldChange(e.target.value)} style={styles.input}>
          <option value="">Select Field</option>
          {possibleFields.map(f => (
            <option key={f.path} value={f.path}>{f.path} ({f.type})</option>
          ))}
        </select>

        <input type="text" placeholder="Label" value={form.label} style={styles.inputLable} disabled />

        <select value={form.filterType} onChange={(e) => setForm({ ...form, filterType: e.target.value })} style={styles.input}>
          <option value="">Select Filter Type</option>
          <option value="enum">Enum</option>
          {/* <option value="string">String</option> */}
          {/* <option value="number">Number</option> */}
        </select>

        {form.filterType === "enum" && form.options.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {form.options.map(opt => (
              <div key={opt} style={styles.optionChip}>
                {opt}
                <span style={styles.removeBtn} onClick={() => handleRemoveOption(opt)}>×</span>
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={styles.button}>Create Filter</button>
      </form>

      {filterList.length > 0 && <h3 style={{ marginTop: 25, marginBottom: 10 }}>Existing Filters</h3>}
      <div>
        {filterList.map(f => (
          <div key={f._id} style={styles.filterCard}>
            <div>
              <span style={{ fontWeight: "bold" }}>{f.label}</span>
              <span style={{ fontStyle: "italic", color: "#555", marginLeft: 5 }}>— {f.fieldPath}</span>
            </div>
            <div>
              <button style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 12 }}
                      onClick={() => deleteFilter(f._id).then(() => {
                        setFilters(prev => prev.filter(x => x._id !== f._id));
                        setFilterList(prev => prev.filter(x => x._id !== f._id));
                      })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
