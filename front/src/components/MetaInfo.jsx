// components/MetaInfo.jsx
import React from "react";

export default function MetaInfo({ meta }) {
  if (!meta) return null;

  const parsedFilters = meta.parsed ?? {};
  const filterEntries = Object.entries(parsedFilters);

  const isMore = filterEntries.length > 3;

  const CARD_STYLE = {
    margin: "0 auto",
    padding: "0px 18px 0px 18px",
    borderRadius: "10px",
    background: "#fff",
    border: "1px solid #dcdcdc",
    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
    display: "flex",
    flexWrap: "wrap",
    gap: isMore ? "8px" : "12px",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    transition: "0.25s",
  };

  const CHIP_STYLE = {
    padding: isMore ? "4px 10px" : "6px 14px",
    borderRadius: "6px",
    background: "#f5f8ff",
    border: "1px solid #d6e4ff",
    fontSize: isMore ? "12px" : "14px",
    color: "#1c3d7a",
    fontWeight: "600",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
    transition: "0.25s",
    cursor: "default",
  };

  return (
    <div style={CARD_STYLE}>
      {filterEntries.length > 0 ? (
        <>
          <span
            style={{
              fontSize: isMore ? "14px" : "15px",
              fontWeight: "700",
              color: "#333",
              paddingRight: "4px",
              whiteSpace: "nowrap",
            }}
          >
            Filters Applied:
          </span>

          {filterEntries.map(([key, value]) => (
            <div
              key={key}
              style={CHIP_STYLE}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f0ff";
                e.currentTarget.style.borderColor = "#b4ceff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f8ff";
                e.currentTarget.style.borderColor = "#d6e4ff";
              }}
            >
              {key}:{" "}
              <strong style={{ fontWeight: 800 }}>
                {value.eq ?? JSON.stringify(value)}
              </strong>
            </div>
          ))}
        </>
      ) : (
        <span
          style={{
            fontSize: "14px",
            padding: "5px 8px",
            color: "#666",
            fontWeight: "500",
            opacity: 0.8,
          }}
        >
          No filters applied
        </span>
      )}
    </div>
  );
}
