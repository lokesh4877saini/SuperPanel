export default function TotalBadge({ title, meta }) {
    const filteredCount = meta?.count ?? 0;
    const totalCount = meta?.totalCount ?? 0;
  
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0px 20px",
          borderRadius: 12,
          background: "linear-gradient(135deg, #fff3f0, #ffe1dc)",
          color: "#2b2b2b",
          fontSize: 20,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(255, 140, 120, 0.25)",
          border: "1px solid rgba(255, 150, 130, 0.35)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 800 }}>{title}</span>
  
        <span
          style={{
            fontSize: 28,
            fontWeight: 900,
            borderRadius: 10,
            padding: "4px 12px",
            // background: "linear-gradient(135deg, #ffb8a8, #ff9f88)",
            color: "#1d1d1d",
            // boxShadow: "0 3px 10px rgba(255, 120, 100, 0.35)",
            // border: "1px solid rgba(255, 120, 100, 0.45)",
          }}
        >
          {filteredCount} / {totalCount}
        </span>
      </div>
    );
  }
  