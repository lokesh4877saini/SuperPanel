function extractPaths(schema, prefix = "") {
  let paths = [];

  schema.eachPath((key, type) => {
 
    if (key === "_id" || key === "__v") return;

    const fullPath = prefix ? `${prefix}.${key}` : key;

 
    if (fullPath.endsWith("._id")) return;

 
    if (type.instance === "Embedded" || type.schema) {
      paths = paths.concat(extractPaths(type.schema, fullPath));
      return;
    }

    // -------------------------
    // normalize searchable type
    // -------------------------
    let searchType = "text";

    if (type.options?.enum?.length) {
      searchType = "enum";
    } else if (/phone|mobile|contact/i.test(fullPath)) {
      searchType = "phone";
    } else {
      switch (type.instance) {
        case "Number":
          searchType = "number";
          break;
        case "Date":
          searchType = "date";
          break;
        case "Boolean":
          searchType = "boolean";
          break;
        default:
          searchType = "text";
      }
    }

    paths.push({
      path: fullPath,
      label: key,
      type: searchType
    });
  });

  return paths;
}

module.exports = extractPaths;
