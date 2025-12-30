import { useEffect, useState } from "react";
import UniversalPanelHeader from "../components/UniversalPanelHeader";
import DynamicTable from "../components/DynamicTable";
import userColumns from '../utils/userColumns';
import MetaInfo from "../components/MetaInfo";
import { getAllowedFilters,getQueryBasedData } from "../api/panelApi";
import useDebounce from '../hooks/useDebounce';

export default function SuperAdmin() {
  const [allowedFilters, setAllowedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load admin panel allowed filters
  const panel = import.meta.env.VITE_SUPER_ADMIN_PANEL_URL.includes("/superadmin")
  ? "superadmin":'';

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllowedFilters(panel);
        if (data.allowedFilters) setAllowedFilters(data.allowedFilters);
      } catch (e) {
        console.error("allowedFilters error", e);
      }
    }
    load();
  }, []);

  const debouncedSearch = useDebounce(searchValue, 500);


  // Load users based on filters
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryObj = {
        panel,
        ...selectedFilters,
      };
  
      if (debouncedSearch && debouncedSearch.trim() !== "") {
        queryObj.search = debouncedSearch.trim(); 
      }
  
      const query = new URLSearchParams(queryObj).toString();
      const payload = await getQueryBasedData(query);
      const returnedUsers = payload.data ?? payload;
  
      setMeta(payload.meta ?? null);
      setUsers(Array.isArray(returnedUsers) ? returnedUsers : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    loadUsers();
  }, [selectedFilters,debouncedSearch]);

  // Clean reusable panel styles
  const styles = {
    page: {
      padding: 20,
      textAlign: "center",
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
    },
    subtitle: {
      fontSize: 17,
      fontWeight: 500,
      color: "#4a5568",
      textAlign: "center",
      maxWidth: 600,
      lineHeight: 1.5,
      margin: "0 auto 25px auto",
      opacity: 0.85,
    },
    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      marginTop: 20
    },
    table: {
      borderCollapse: "collapse",
      width: "max-content",
      minWidth: 1200,
      fontFamily: "Arial, sans-serif",
      tableLayout: "auto"
    },
    th: {
      padding: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#f9f9f9",
      textAlign: "left",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
      zIndex: 2
    },
    td: {
      padding: "8px",
      border: "1px solid #ddd",
      verticalAlign: "top",
      whiteSpace: "nowrap"
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-IN");
  };

  return (
    <div style={styles.page}>

      {/* Modern subtitle */}
      <p style={styles.subtitle}>
        View, filter, and monitor all registered users in the system.
      </p>

      <UniversalPanelHeader
        title="Users"
        meta={meta}
        filters={allowedFilters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <DynamicTable 
          columns={userColumns}
          data={users} styles={styles}
          formatDate={formatDate}
          actions={{
            onEdit: (row) => console.log("Edit", row),
            onRemove: (row) => console.log("Remove", row),
            onView: (row) => console.log("View", row),
          }}
             />
        </div>
      )}
    </div>
  );
}
