import SharedDropdown from "./SharedDropdown";
import SearchBar from "./SearchBar";
import MetaInfo from "./MetaInfo";
import TotalBadge from "./TotalBadge";

export default function UniversalPanelHeader({
  title = "Total Items",
  filters = [],
  selectedFilters,
  setSelectedFilters,
  searchValue,
  setSearchValue,
  meta,
}) {
  return (
    <>
      {/* Responsive Grid Styles */}
      <style>
        {`
        .responsive-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-areas:
            "download search"
            "usercount usercount";
          gap: 10px;
          width:fit-content;
          margin-top: 10px;
        }

        .grid-download { grid-area: download; }
        .grid-search { grid-area: search; }
        .grid-usercount { 
          grid-area: usercount; 
          display: flex;
          justify-content: center;
        }

        /* Stack everything on small screens */
        @media (max-width: 600px) {
          .responsive-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "download"
              "search"
              "usercount";
          }
        }
      `}
      </style>
      <style>
{`
  .filter-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "filters filters"
      "info info";
    width: 100%;
  }

  .grid-filters { grid-area: filters; }
  .grid-info { grid-area: info; }

  /* Mobile: stack */
  @media (max-width: 600px) {
    .filter-info-grid {
      grid-template-columns: 1fr;
      grid-template-areas:
        "filters"
        "info";
    }
  }
`}
</style>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent:"space-between",
          gap: "20px",
          marginBottom: "1.8rem",
          width: "100%",
        }}
      >
        {/* Filters */}
        <div className="filter-info-grid">
          {/* FILTER SECTION */}
          <div className="grid-filters"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            {filters.map((filter) => {
              const key = filter.categoryId;
              return (
                <div key={key} style={{ minWidth: 160 }}>
                  <SharedDropdown
                    label={filter.label}
                    options={(filter.options || []).map((opt) => ({
                      _id: opt,
                      label: opt,
                      value: opt,
                    }))}
                    value={selectedFilters[key] || ""}
                    onChange={(value) =>
                      setSelectedFilters((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* META INFO (BOTTOM, CENTERED) */}
          {filters.length > 0 && (
            <div className="grid-info" style={{ display: "flex", justifyContent: "center" }}>
              <MetaInfo meta={meta} />
            </div>
          )}

        </div>

        {/* Download + Search + User Count Grid */}
        <div className="responsive-grid">
          {/* Download Button */}
          <button
            className="grid-download"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              minHeight: "48px",
            }}
          >
            Download
          </button>

          {/* Search */}
          <div className="grid-search">
            <SearchBar value={searchValue} onChange={setSearchValue} />
          </div>

          {/* User Count */}
          <div className="grid-usercount">
            <TotalBadge title={title} meta={meta} />
          </div>
        </div>
      </div>
    </>
  );
}
