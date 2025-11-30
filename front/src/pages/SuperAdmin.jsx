import { useEffect, useState } from "react";
import UniversalPanelHeader from "../components/UniversalPanelHeader";
import MetaInfo from "../components/MetaInfo";
import { getAllowedFilters,getQueryBasedData } from "../api/panelapi";
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
      {allowedFilters.length > 0 && (
      <MetaInfo meta={meta} />
      )}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "DOB",
                  "Gender",
                  "Payment Status",
                  "Payment Method",
                  "Last Paid Date",
                  "Invoices",
                  "Company",
                  "Department",
                  "Job Title",
                  "Employee ID",
                  "Contract Type",
                  "Contract Start",
                  "Contract End",
                  "Salary Base",
                  "HRA",
                  "Bonus",
                  "Travel Status",
                  "KYC Verified",
                  "Aadhaar",
                  "PAN",
                  "Passport",
                  "Language",
                  "Theme Mode",
                  "Font Size",
                  "Color Blind Mode",
                  "Email Notifications",
                  "SMS Notifications",
                  "Account Status",
                  "Last Login"
                ].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id || Math.random()}>
                  <td style={styles.td}>{u.basic_info?.name ?? "-"}</td>
                  <td style={styles.td}>{u.basic_info?.email ?? "-"}</td>
                  <td style={styles.td}>{u.basic_info?.phone ?? "-"}</td>
                  <td style={styles.td}>{formatDate(u.basic_info?.dob)}</td>
                  <td style={styles.td}>{u.basic_info?.gender ?? "-"}</td>

                  {/* Payment */}
                  <td style={styles.td}>{u.payment_detail?.status ?? "-"}</td>
                  <td style={styles.td}>{u.payment_detail?.method ?? "-"}</td>
                  <td style={styles.td}>{formatDate(u.payment_detail?.last_paid_date)}</td>
                  <td style={styles.td}>
                    {(u.payment_detail?.invoices || []).length === 0
                      ? "-"
                      : (u.payment_detail.invoices || []).map((inv) => (
                          <div key={inv.invoice_id || inv._id}>
                            {inv.invoice_id ?? inv._id} | {inv.amount ?? "-"} |{" "}
                            {inv.mode ?? "-"} | {formatDate(inv.paid_on)}
                          </div>
                        ))}
                  </td>

                  {/* Employment */}
                  <td style={styles.td}>{u.employment?.company ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.department ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.job_title ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.employee_id ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.contract?.type ?? "-"}</td>
                  <td style={styles.td}>{formatDate(u.employment?.contract?.start_date)}</td>
                  <td style={styles.td}>
                    {u.employment?.contract?.end_date
                      ? formatDate(u.employment.contract.end_date)
                      : "-"}
                  </td>
                  <td style={styles.td}>{u.employment?.contract?.salary_breakup?.base ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.contract?.salary_breakup?.hra ?? "-"}</td>
                  <td style={styles.td}>{u.employment?.contract?.salary_breakup?.bonus ?? "-"}</td>

                  {/* Travel & KYC */}
                  <td style={styles.td}>{u.travel_details?.travel_status ?? "-"}</td>
                  <td style={styles.td}>{u.kyc?.verified ? "Yes" : "No"}</td>

                  <td style={styles.td}>
                    {u.kyc?.documents?.aadhaar?.number ?? "-"} |{" "}
                    {u.kyc?.documents?.aadhaar?.verified ? "Yes" : "No"}
                  </td>
                  <td style={styles.td}>
                    {u.kyc?.documents?.pan?.number ?? "-"} |{" "}
                    {u.kyc?.documents?.pan?.verified ? "Yes" : "No"}
                  </td>
                  <td style={styles.td}>
                    {u.kyc?.documents?.passport?.number ?? "-"} |{" "}
                    {u.kyc?.documents?.passport?.verified ? "Yes" : "No"} |{" "}
                    {formatDate(u.kyc?.documents?.passport?.expiry)}
                  </td>

                  {/* Preferences */}
                  <td style={styles.td}>{u.preferences?.language ?? "-"}</td>
                  <td style={styles.td}>{u.preferences?.ui?.theme?.mode ?? "-"}</td>
                  <td style={styles.td}>
                    {u.preferences?.ui?.theme?.settings?.font_size ?? "-"}
                  </td>
                  <td style={styles.td}>
                    {u.preferences?.ui?.theme?.settings?.color_blind_mode ? "Yes" : "No"}
                  </td>

                  {/* Notifications */}
                  <td style={styles.td}>
                    Email: {u.notifications?.email?.enabled ? "Yes" : "No"} <br />
                    Marketing: {u.notifications?.email?.settings?.marketing ? "Yes" : "No"}<br />
                    Transactional: {u.notifications?.email?.settings?.transactional ? "Yes" : "No"}<br />
                    Alerts: {u.notifications?.email?.settings?.alerts ? "Yes" : "No"}
                  </td>

                  <td style={styles.td}>
                    SMS: {u.notifications?.sms?.enabled ? "Yes" : "No"}<br />
                    OTP: {u.notifications?.sms?.settings?.otp ? "Yes" : "No"}<br />
                    Alerts: {u.notifications?.sms?.settings?.alerts ? "Yes" : "No"}
                  </td>

                  <td style={styles.td}>{u.account_status ?? "-"}</td>
                  <td style={styles.td}>{formatDate(u.last_login)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
