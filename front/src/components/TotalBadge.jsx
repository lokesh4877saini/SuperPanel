export default function TotalBadge({ title, meta }) {
  const filteredCount = meta?.count ?? 0;
  const totalCount = meta?.totalCount ?? 0;

  return (
    <div
      style={{
        height: "48px",                
        width: "100%",                 
        display: "flex",
        justifyContent: "center",      
        alignItems: "center",          
        gap: "10px",
        borderRadius: "8px",           
        background: "#fff",            
        border: "1px solid #ccc",      
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
        transition: "all 0.25s ease",
        cursor: "default",
      }}

      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
      }}
    >
      <span style={{ fontWeight: 700 }}>{title}</span>

      <span
        style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "#007bff",          // Accent color, same as focus color
        }}
      >
        {filteredCount} / {totalCount}
      </span>
    </div>
  );
}
