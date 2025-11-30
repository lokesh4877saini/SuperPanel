// components/MetaInfo.jsx
import React from "react";

export default function MetaInfo({ meta }) {
  if (!meta) return null;

  const parsedFilters = meta.parsed ?? {};
  const filterEntries = Object.entries(parsedFilters);

  return (
    <div
      style={{
        margin: "20px auto",
        padding: "15px 25px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #fff7f0, #ffe7dc)",
        border: "1px solid #ffc8a0",
        boxShadow: "0 6px 12px rgba(255, 160, 120, 0.15)",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "90%",
      }}
    >
      {filterEntries.length > 0 ? (
        <>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#5a4636",
              marginRight: 8,
            }}
          >
            Filters Applied:
          </span>
          {filterEntries.map(([key, value]) => (
            <div
              key={key}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: "#fff1e6",
                border: "1px solid #ffbc91",
                fontSize: 13,
                color: "#4a3621",
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(255, 150, 100, 0.2)",
                whiteSpace: "nowrap",
                transition: "0.2s",
              }}
            >
              {key}: <strong>{value.eq ?? JSON.stringify(value)}</strong>
            </div>
          ))}
        </>
      ) : (
        <span style={{ fontSize: 14, color: "#7a5a4a" }}>
          No filters applied
        </span>
      )}
    </div>
  );
}
