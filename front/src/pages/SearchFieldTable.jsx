const SearchFieldTable = ({ searchableFields, toggleSearchable, panel }) => {
  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 15 }}>
        Searchable Fields for{" "}
        <span style={{ color: "#4f46e5" }}>
          {panel?.toUpperCase()}
        </span>
      </h2>

      {/* Responsive Wrapper */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 10,
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          background: "#fff"
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "600px", // Prevent collapse on small screens
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: 12, fontWeight: 600 }}>Label</th>
              <th style={{ padding: 12, fontWeight: 600 }}>Field Path</th>
              <th style={{ padding: 12, fontWeight: 600 }}>Searchable</th>
            </tr>
          </thead>

          <tbody>
            {searchableFields.map((field) => (
              <tr
                key={field._id}
                onClick={() => toggleSearchable(field)}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  background: field.isSearchable ? "#eef2ff" : "#fff",
                  transition: "0.2s",
                  cursor: "pointer"
                }}
              >
                <td style={{ padding: 12 }}>{field.label}</td>
                <td style={{ padding: 12, color: "#555" }}>{field.path}</td>

                <td style={{ padding: 12 }}>
                  <div
                    style={{
                      cursor: "pointer",
                      width: 52,
                      height: 26,
                      background: field.isSearchable
                        ? "#4f46e5"
                        : "#cbd5e1",
                      borderRadius: 13,
                      position: "relative",
                      transition: "0.3s"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: field.isSearchable ? 28 : 3,
                        width: 20,
                        height: 20,
                        background: "#fff",
                        borderRadius: "50%",
                        transition: "0.25s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Enhancements (optional): small spacing */}
      <div style={{ height: 10 }} />
    </div>
  );
};

export default SearchFieldTable;
