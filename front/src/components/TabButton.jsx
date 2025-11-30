export default function TabButton ({ active, onClick, children }){
    const baseStyle = {
      padding: "8px 16px",
      cursor: "pointer",
      borderRadius: 8,
      border: "none",
      transition: "0.25s",
      fontWeight: 500
    };
  
    const activeStyle = {
      background: "#4f46e5",
      color: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    };
  
    const inactiveStyle = {
      background: "#e4e7f0",
      color: "#333"
    };
  
    return (
      <button
        onClick={onClick}
        style={{ ...baseStyle, ...(active ? activeStyle : inactiveStyle) }}
      >
        {children}
      </button>
    );
  };