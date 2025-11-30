import SharedDropdown from "./SharedDropdown";
import SearchBar from "./SearchBar";
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: "1.8rem",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          flexGrow: 1,
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

      {/* Search */}
      <SearchBar value={searchValue} onChange={setSearchValue} />

      {/* Total Badge */}
      <TotalBadge title={title} meta={meta} />
    </div>
  );
}
