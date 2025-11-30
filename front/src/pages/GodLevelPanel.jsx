import { useEffect, useState } from "react";
import {
  getAllFilters,
  getSeachableFields,
  updateSeachableFields,
  getPanelFilters,
  updatePanelFilters
} from "../api/godApi";
import FilterCreator from "./FilterCreator";
import SearchFieldTable from './SearchFieldTable';
import TabButton from '../components/TabButton'

export default function GodLevelPanel() {
  const [filters, setFilters] = useState([]);
  const [panels] = useState(["superadmin", "admin", "visitor"]);
  const [selectedPanel, setSelectedPanel] = useState("superadmin");
  const [panelFilters, setPanelFilters] = useState([]);
  const [searchableFields, setSearchableFields] = useState([]);
  const [activeTab, setActiveTab] = useState("filters");

  // Load all filters
  useEffect(() => {
    getAllFilters().then(setFilters);
  }, []);

  // Load searchable fields for selected panel
  useEffect(() => {
    getSeachableFields(selectedPanel).then(setSearchableFields);
  }, [selectedPanel]);

  // Load filters enabled for selected panel
  useEffect(() => {
    async function loadPanelFilters() {
      const data = await getPanelFilters(selectedPanel);
      if (data.allowedFilters) {
        setPanelFilters(data.allowedFilters.map(f => f._id));
      }
    }
    loadPanelFilters();
  }, [selectedPanel]);

  // Toggle filter per panel
  const toggleFilterForPanel = async (filterId) => {
    const updated = panelFilters.includes(filterId)
      ? panelFilters.filter(id => id !== filterId)
      : [...panelFilters, filterId];

    setPanelFilters(updated);
    await updatePanelFilters(selectedPanel, updated);
  };

  // Toggle searchable field PER PANEL
  const toggleSearchable = async (field) => {
    const updated = !field.isSearchable;

    await updateSeachableFields(field._id, updated, selectedPanel);

    setSearchableFields(prev =>
      prev.map(f =>
        f._id === field._id ? { ...f, isSearchable: updated } : f
      )
    );
  };

  // ---------------- STYLES ----------------
  const styles = {
    container: { padding: 30, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f5f7fa", minHeight: "100vh", color: "#333" },
    header: { fontSize: 32, fontWeight: "bold", marginBottom: 20 },
    section: { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: 30 },
    panelTabs: { display: "flex", gap: 15, marginBottom: 20 },
    tab: (active) => ({ padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: active ? "#4f46e5" : "#e4e7f0", color: active ? "#fff" : "#333", fontWeight: active ? "bold" : "normal", transition: "0.3s" }),
    filterList: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 15, marginTop: 10 },
    filterCard: { padding: 15, borderRadius: 10, background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "0.2s", cursor: "pointer" },
    hr: { margin: "40px 0", borderColor: "#e2e8f0" }
  };

  const tabs = [
    { key: "filters", label: "Filters" },
    { key: "searchable", label: "Searchable Fields" },
    { key: "download", label: "Download" },
    { key: "rowVisibility", label: "Row Visibility" }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
  
      case "filters":
        return (
          <div style={styles.section}>
            <FilterCreator
              reloadFilters={() => getAllFilters().then(setFilters)}
              setFilters={setFilters}
            />
          </div>
        );
  
      case "searchable":
        return (
          <div style={styles.section}>
            <SearchFieldTable
              searchableFields={searchableFields}
              toggleSearchable={toggleSearchable}
              panel={selectedPanel}
            />
          </div>
        );
  
      case "download":
        return (
          <div
            style={{
              padding: "15px 20px",
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              borderRadius: 8,
              marginBottom: 20,
              color: "#0369a1",
              fontSize: 14,
              lineHeight: 1.6
            }}
          >
            <b>Panel-Specific Download Info:</b><br />
            Every panel (<b>{selectedPanel.toUpperCase()}</b>) has its own set of
            searchable and downloadable fields.
            <br /><br />
            ✔ Fields you <b>enable</b> for this panel will appear in the downloaded CSV/Excel.  
            <br />
            ✖ Fields you <b>disable</b> will be hidden in this panel's export.
            <br /><br />
            This allows <b>Superadmin, Admin, and Visitor</b> to have different report structures.
          </div>
        );
  
      case "rowVisibility":
        return (
          <div
            style={{
              padding: "20px",
              background: "#fef9c3",
              border: "1px solid #facc15",
              borderRadius: 10,
              color: "#854d0e",
              fontSize: 15,
              lineHeight: 1.6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}
          >
            <h3 style={{ marginBottom: 8, color: "#a16207" }}>
              Row Visibility Control (Under Construction)
            </h3>
  
            <p>
              Soon you will control which rows are <b>visible</b> or <b>hidden</b> 
              per panel (<b>SUPERADMIN</b>, <b>ADMIN</b>, <b>VISITOR</b>).
            </p>
  
            <p style={{ marginTop: 8 }}>
              Each panel will have its own visibility rules — managed entirely from 
              the <b>God Level Panel</b>.  
              You will be able to toggle visibility similar to filters and searchable fields.
            </p>
  
            <p style={{ marginTop: 8, fontStyle: "italic" }}>
              🚧 This feature is currently in development.
            </p>
          </div>
        );
  
      default:
        return null;
    }
  };
  
  

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>God Panel</h1>

      {/* Panel Selector Tabs */}
      <div style={styles.section}>
        <h2>Panel Permissions</h2>
        <div style={styles.panelTabs}>
          {panels.map(p => (
            <div
              key={p}
              style={styles.tab(p === selectedPanel)}
              onClick={() => setSelectedPanel(p)}
            >
              {p.toUpperCase()}
            </div>
          ))}
        </div>

        {filters.length > 0 && (
          <>
            <h2>Enable / Disable Filters for {selectedPanel.toUpperCase()}</h2>

            <div style={styles.filterList}>
              {filters.map(filter => {
                const enabled = panelFilters.includes(filter._id);
                return (
                  <div
                    key={filter._id}
                    style={styles.filterCard}
                    onClick={() => toggleFilterForPanel(filter._id)}
                  >
                    <span>{filter.label}</span>
                    <div style={{ width: 50, height: 24, background: enabled ? "#4f46e5" : "#ccc", borderRadius: 12, position: "relative", transition: "0.3s" }}>
                      <div style={{ position: "absolute", top: 2, left: enabled ? 26 : 2, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Show Enabled Searchable Fields */}
        {searchableFields.filter(f => f.isSearchable).length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>
              Enabled Searchable Fields for {selectedPanel.toUpperCase()}
            </h2>

            <div style={styles.filterList}>
              {searchableFields
                .filter(field => field.isSearchable)
                .map(field => (
                  <div
                    key={field._id}
                    style={styles.filterCard}
                    onClick={() => toggleSearchable(field)}
                  >
                    <div>
                      <strong>{field.label}</strong>
                      {/* <div style={{ fontSize: 12, opacity: 0.6 }}>{field.path}</div> */}
                    </div>

                    {/* Toggle Switch */}
                    <div
                      style={{
                        width: 50,
                        height: 24,
                        background: field.isSearchable ? "#4f46e5" : "#ccc",
                        borderRadius: 12,
                        position: "relative",
                        transition: "0.3s"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: field.isSearchable ? 26 : 2,
                          width: 20,
                          height: 20,
                          background: "#fff",
                          borderRadius: "50%",
                          transition: "0.3s"
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

      </div>

      {/* Tab Buttons */}
      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {renderActiveTab()}

    </div>
  );
}
