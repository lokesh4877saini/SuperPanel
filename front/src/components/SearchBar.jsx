export default function SearchBar({ value, onChange }) {
  return (
    <input
      placeholder="Search users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: "48px",            
        width: "260px",            
        padding: "0 14px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "15px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.25s ease",
        outline: "none",
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
    />
  );
}
