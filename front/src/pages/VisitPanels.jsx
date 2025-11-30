import React from "react";

// Read panel URLs from environment variables
const GOD_PANEL_URL = import.meta.env.VITE_GOD_PANEL_URL || "/god";
const SUPER_ADMIN_URL = import.meta.env.VITE_SUPER_ADMIN_PANEL_URL || "/superadmin";
const ADMIN_URL = import.meta.env.VITE_VISITOR_PANEL_URL || "/admin";

export default function VisitorPage() {
  const panels = [
    {
      name: "God Level Panel",
      url: GOD_PANEL_URL,
      description: "Full control over all filters and permissions."
    },
    {
      name: "Super Admin Panel",
      url: SUPER_ADMIN_URL,
      description: "Limited access panel. View data according to allowed filters."
    },
    {
      name: "Admin Panel",
      url: ADMIN_URL,
      description: "Normal panel"
    }
  ];

  return (
    <div style={{ padding: 40, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ marginBottom: 20 }}>Visit Panels</h1>
      <p style={{ marginBottom: 30 }}>Please select your panel to continue:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {panels.map((panel) => (
          <a
            key={panel.name}
            href={panel.url}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 12,
              background: "#f5f5f5",
              textDecoration: "none",
              color: "#333",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              transition: "0.3s",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20 }}>{panel.name}</h2>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#555" }}>
              {panel.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
