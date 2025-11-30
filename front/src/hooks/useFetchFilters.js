import { useEffect, useState } from "react";

export default function useFetchFilters(panel) {
  const [filters, setFilters] = useState([]);   // categoryId list
  const [options, setOptions] = useState({});   // { gender: ["male", "female"] }

  useEffect(() => {
    async function load() {
      // Get allowed filter IDs for panel
      const panelRes = await fetch(`http://localhost:5000/api/panel/${panel}/filters`);
      const panelData = await panelRes.json();
      
      const allowedFilters = panelData.allowedFilters || [];
      const allowedIds = allowedFilters.map(f => f._id);

      // Fetch all filter definitions
      const allRes = await fetch("http://localhost:5000/api/god/Allfilter");
      const allFilters = await allRes.json();

      //  Keep only filters that belong to this panel
      const panelFilterObjects = allFilters.filter(f => allowedIds.includes(f._id));

      //  Store category names for Admin panel dropdowns
      setFilters(panelFilterObjects.map(f => f.categoryId));

      //  Load options for each filter
      const optionMap = {};
      panelFilterObjects.forEach(f => {
        optionMap[f.categoryId] = f.options || [];
      });

      setOptions(optionMap);
    }

    load();
  }, [panel]);

  return { filters, options };
}
