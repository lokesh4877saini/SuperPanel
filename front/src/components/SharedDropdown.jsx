export default function SharedDropdown({ label, options, value, onChange }) {
  return (
    <div
      style={{
        minWidth: 180,
        maxWidth: 220,
        margin: 0,
        position: "relative",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 14,
          backgroundColor: "#fff",
          cursor: "pointer",
          appearance: "none",
          outline: "none",
          transition: "0.2s",
          color: value ? "#111" : "#888",
        }}
      >
        {/* Default visible "Select FilterName" option */}
        <option value="">
          Select {label}
        </option>

        {options.map((opt) => (
          <option key={opt._id} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Optional: custom arrow if needed */}
      {/* 
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid #555",
        }}
      /> 
      */}
    </div>
  );
}
