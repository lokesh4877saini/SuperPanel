export default function SharedDropdown({ label, options, value, onChange }) {
  return (
    <div
      style={{
        minWidth: 180,
        maxWidth: 260,
        position: "relative",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          margin:"12px 0",
          height: "48px",                     
          padding: "0 14px",                   
          borderRadius: "8px",                
          border: "1px solid #ccc",
          fontSize: "15px",                   
          backgroundColor: "#fff",
          cursor: "pointer",
          appearance: "none",
          outline: "none",
          color: value ? "#111" : "#888",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.25s ease",
        }}

        onFocus={(e) => {
          e.target.style.borderColor = "#007BFF";
          e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.25)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        }}
        onMouseOver={(e) => {
          e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        }}
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt._id} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "6px solid #666",
        }}
      />
    </div>
  );
}
