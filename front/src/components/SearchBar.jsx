export default function SearchBar({ value, onChange }) {
    return (
      <input
        placeholder="Search users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 14px",
          width: 260,
          borderRadius: 10,
          border: "1px solid #ddd",
          fontSize: 15,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
      />
    );
  }
  