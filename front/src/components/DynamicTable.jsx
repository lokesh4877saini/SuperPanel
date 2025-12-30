import React, { memo } from "react";

// Safe nested access
const getValueFromPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc !== undefined && acc !== null ? acc[key] : null), obj);

// Row component with memo
const TableRow = memo(({ row, columns, styles, formatDate, actions }) => {
  return (
    <tr className="table-row">
      {columns.map((col) => {
        let value = getValueFromPath(row, col.path);

        // Custom render function
        if (col.render) value = col.render(value, row, actions);

        // Format date
        if (col.isDate) value = value ? formatDate(value) : "-";

        // Format boolean
        if (typeof value === "boolean") value = value ? "Yes" : "No";

        // Handle arrays
        if (Array.isArray(value)) {
          value =
            value.length === 0
              ? "-"
              : value.map((v, i) => (
                  <div key={i} style={{ whiteSpace: "nowrap" }}>
                    {typeof v === "object" && !React.isValidElement(v)
                      ? Object.entries(v)
                          .map(([k, val]) =>
                            val instanceof Date
                              ? `${k}: ${formatDate(val)}`
                              : typeof val === "boolean"
                              ? `${k}: ${val ? "Yes" : "No"}`
                              : `${k}: ${val}`
                          )
                          .join(" | ")
                      : v}
                  </div>
                ));
        }

        // Handle objects safely
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          if (!React.isValidElement(value)) value = Object.keys(value).length ? "[Object]" : "-";
        }

        return <td key={col.path} style={styles.td}>{value ?? "-"}</td>;
      })}
    </tr>
  );
});

export default function DynamicTable({ columns, data, styles, formatDate, actions }) {
  return (
    <div style={{ ...styles.tableWrapper, overflowX: "auto", display:"grid" ,placeItems:"center"}}>
      <table style={{...styles.table,border:"2px"}} className="dynamic-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.path} style={{
                ...styles.th,
                fontWeight:"bolder",
                color:"white",
                textAlign:"center",
                borderRadius:"5px",
                background:"black"
                
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow
              key={row._id || Math.random()}
              row={row}
              columns={columns}
              styles={styles}
              formatDate={formatDate}
              actions={actions}
            />
          ))}
        </tbody>
      </table>

      {/* CSS-in-JS styles or global CSS */}
      <style>
        {`
          .dynamic-table {
            border-collapse: collapse;
            width: 100%;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          .dynamic-table th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            position: sticky;
            top: 0;
            z-index: 1;
          }
          .dynamic-table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
          }
          .table-row:hover {
            background-color: #f9fafb;
          }
          .dynamic-table tr:nth-child(even) {
            background-color: #ffffff;
          }
          .dynamic-table tr:nth-child(odd) {
            background-color: #fefefe;
          }
          .action-btn {
            border: none;
            cursor: pointer;
            padding: 5px 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .action-btn.view { background-color: #3b82f6; color: white; }
          .action-btn.edit { background-color: #f59e0b; color: white; }
          .action-btn.remove { background-color: #ef4444; color: white; }
          .action-btn:hover { opacity: 0.8; }
        `}
      </style>
    </div>
  );
}
