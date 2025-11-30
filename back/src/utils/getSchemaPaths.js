function extractPaths(schema, prefix = "") {
    let paths = [];
  
    schema.eachPath((key, type) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
  
      if (type.instance === "Embedded" || type.schema) {
        paths = paths.concat(extractPaths(type.schema, fullPath));
      } 
      else {
        paths.push({
          path: fullPath,
          type: type.instance,
          enum: type.options.enum || null
        });
      }
    });
  
    return paths;
  }
  
  module.exports = extractPaths;
  