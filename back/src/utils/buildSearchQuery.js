  function buildSearchOrConditions(searchValue,searchableFields)
  {
    if (!searchValue || !searchableFields?.length) return [];  
    const orConditions = [];
    const trimmed = searchValue.trim();
    for (const field of searchableFields) {
      const { path, type, normalize } = field;
      switch (type) {
        case "enum":
          orConditions.push({
            [path]: normalize === "lowercase"
              ? trimmed.toLowerCase()
              : trimmed
          });
          break;
  
        case "phone":
          if (/^\d+$/.test(trimmed)) {
            orConditions.push({
              $expr: {
                $eq: [{ $toString: `$${path}` }, trimmed]
              }
            });
          }
          break;
  
        case "number":
          if (!isNaN(trimmed)) {
            orConditions.push({ [path]: Number(trimmed) });
          }
          break;
  
        case "date": {
          const date = new Date(trimmed);
          if (!isNaN(date.getTime())) {
            orConditions.push({
              [path]: {
                $gte: date,
                $lt: new Date(date.getTime() + 86400000)
              }
            });
          }
          break;
        }
  
        case "text":
        default:
          orConditions.push({
            [path]: { $regex: trimmed, $options: "i" }
          });
      }
    }
    return orConditions;
  };
  module.exports = buildSearchOrConditions;