// utils/queryBuilder.js
// Production-ready enterprise dynamic query builder for MongoDB (Mongoose).
//
// Usage modes:
// 1) Simple query params:
//    GET /users?gender=male
//    GET /users?salary[gte]=30000&salary[lte]=60000
//    GET /users?flight_number[regex]=^EK
//
// 2) Advanced JSON filter:
//    POST /users?panel=admin
//    body: { filter: { "$or": [ { "gender": { "eq": "male" } }, { "salary": { "gte": 40000 } } ] } }
//    or send as querystring encoded JSON: ?filter=%7B%22$or%22%3A...%7D
//
// Preconditions:
// - Load allowedFilters (Filter model documents) for current panel (PanelPermission.populate)
// - Pass those allowedFilters into buildMongoQuery
//
// Filter metadata (Filter model) must contain:
// - categoryId (frontend key), fieldPath (dot path in DB), type (string|number|boolean|date|enum|array),
//   allowedOperators (["eq","gte","lte","in","regex","between","elemMatch",...]), options (enum values)

const DEFAULT_DATE_ISO = true;

function safeParseJSON(str) {
  try { return JSON.parse(str); }
  catch (e) { return null; }
}

// --------------------------
// Helpers: parsing & casting
// --------------------------
function isNumberLike(v) {
  return typeof v === "number" || (typeof v === "string" && v !== "" && !isNaN(v));
}

function castToType(raw, type) {
  if (raw === null || raw === undefined) return raw;

  if (type === "number") {
    if (Array.isArray(raw)) return raw.map(r => Number(r));
    return Number(raw);
  }

  if (type === "boolean") {
    if (raw === "" || raw === undefined || raw === null) return undefined;
  
    const toBool = v => {
      if (v === true || v === false) return v;
      if (v === "true") return true;
      if (v === "false") return false;
      return undefined; // ignore invalid boolean
    };
  
    return Array.isArray(raw) ? raw.map(toBool).filter(v => v !== undefined) : toBool(raw);
  }
  

  if (type === "date") {
    // Accept ISO string or numeric timestamp
    if (Array.isArray(raw)) return raw.map(r => new Date(r));
    return new Date(raw);
  }

  if (type === "array") {
    // if raw is string csv -> split, else if already array -> return
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") return raw.split(",").map(s => s.trim()).filter(s => s.length > 0);
    return [raw];
  }

  // default: string / enum
  return raw;
}

// normalize incoming simple params -> internal shape:
// { categoryId: { op: rawValue, ... }, ... }
function parseSimpleQueryParams(rawQuery) {
  const parsed = {};

  for (const key of Object.keys(rawQuery)) {
    if (key === "panel" || key === "page" || key === "limit" || key === "sort" || key === "filter") continue;
    const val = rawQuery[key];
    if (val === "" || val === null || val === undefined) {
      continue; // skip empty filters
    }
  
    const match = key.match(/(.*?)\[(.*?)\]$/); // e.g. salary[gte]
    if (match) {
      const field = match[1];
      const op = match[2];
      parsed[field] = parsed[field] || {};
      parsed[field][op] = val;
    } else {
      // default -> eq
      parsed[key] = parsed[key] || {};
      parsed[key]["eq"] = val;
    }
  }

  return parsed;
}

// -------------------------------
// Core: convert "parsedFilters" -> Mongo query
// parsedFilters can be:
// - simple map: { gender: { eq: 'male' }, salary: { gte: '40000' } }
// - logical object: { "$or": [ { gender: { eq: 'male' } }, { salary: { gte: 40000 } } ] }
// We will support both.
// allowedFilters: array of Filter documents (populated) from DB
// -------------------------------
function buildMongoQueryFromParsed(parsedFilters, allowedFilters = []) {
  // map categoryId -> metadata for quick lookup
  const metaMap = {};
  for (const f of allowedFilters) {
    metaMap[f.categoryId] = f;
  }

  // recursive transformer for logical nodes ($and/$or) and field nodes
  function transformNode(node) {
    if (node === null || node === undefined) return {};

    // Logical operator object?
    if (typeof node === "object" && !Array.isArray(node)) {
      // if node contains $or or $and keys -> transform each child
      if (node.$or && Array.isArray(node.$or)) {
        return { $or: node.$or.map(child => transformNode(child)) };
      }
      if (node.$and && Array.isArray(node.$and)) {
        return { $and: node.$and.map(child => transformNode(child)) };
      }

      // Otherwise, treat node as map of categoryId -> {op: value}
      const subQuery = {};

      for (const [categoryId, opObj] of Object.entries(node)) {
        // if the user passed a nested logical object inside a field name - not supported
        // Only allow categoryId keys that exist in metaMap
        const meta = metaMap[categoryId];
        if (!meta) {
          // skip unknown/unauthorized filter
          continue;
        }

        const dbPath = meta.fieldPath;
        const type = meta.type || "string";
        const allowedOps = Array.isArray(meta.allowedOperators) ? meta.allowedOperators : ["eq"];

        // If opObj is primitive, treat as eq
        const opContainer = (typeof opObj === "object" && !Array.isArray(opObj)) ? opObj : { eq: opObj };

        // If opContainer has only one op and it's 'eq', set direct equality
        const opsForPath = [];

        for (const [op, rawVal] of Object.entries(opContainer)) {
          
          //skip empty values
          if (rawVal === "" || rawVal === null || rawVal === undefined) {
            continue;
          }
          
          // skip disallowed ops
          if (!allowedOps.includes(op)) {
            continue;
          }

          // handle casting and operations
          if (op === "eq") {
            const v = castToType(rawVal, type);
            // assign equality
            opsForPath.push({ type: "replace", value: v });
          } else if (op === "ne") {
            const v = castToType(rawVal, type);
            opsForPath.push({ type: "op", op: "$ne", value: v });
          } else if (op === "gt") {
            opsForPath.push({ type: "op", op: "$gt", value: castToType(rawVal, type) });
          } else if (op === "gte") {
            opsForPath.push({ type: "op", op: "$gte", value: castToType(rawVal, type) });
          } else if (op === "lt") {
            opsForPath.push({ type: "op", op: "$lt", value: castToType(rawVal, type) });
          } else if (op === "lte") {
            opsForPath.push({ type: "op", op: "$lte", value: castToType(rawVal, type) });
          } else if (op === "in") {
            // allow comma separated strings or arrays
            let arr = rawVal;
            if (!Array.isArray(arr)) arr = String(rawVal).split(",").map(s => s.trim()).filter(Boolean);
            arr = arr.map(x => castToType(x, type));
            opsForPath.push({ type: "op", op: "$in", value: arr });
          } else if (op === "nin") {
            let arr = rawVal;
            if (!Array.isArray(arr)) arr = String(rawVal).split(",").map(s => s.trim()).filter(Boolean);
            arr = arr.map(x => castToType(x, type));
            opsForPath.push({ type: "op", op: "$nin", value: arr });
          } else if (op === "between") {
            // expect "start,end"
            let start = null, end = null;
            if (Array.isArray(rawVal) && rawVal.length >= 2) {
              start = rawVal[0]; end = rawVal[1];
            } else if (typeof rawVal === "string") {
              const parts = rawVal.split(",").map(s => s.trim());
              start = parts[0]; end = parts[1];
            }
            if (start !== undefined && end !== undefined) {
              opsForPath.push({ type: "op", op: "$gte", value: castToType(start, type) });
              opsForPath.push({ type: "op", op: "$lte", value: castToType(end, type) });
            }
          } else if (op === "regex") {
            // pass regex string
            const pattern = String(rawVal);
            const flags = meta && meta.caseInsensitive ? "i" : "i";
            const regex = new RegExp(pattern, flags);
            opsForPath.push({ type: "replace", value: { $regex: regex } });
          } else if (op === "exists") {
            const v = (String(rawVal) === "true");
            opsForPath.push({ type: "op", op: "$exists", value: v });
          } else if (op === "elemMatch" || op === "array_contains") {
            // elemMatch expects an object describing conditions for array elements
            // rawVal should itself be an object like { subfield: { eq: 'x' } } or raw JSON
            // We'll transform it recursively but with metadata lookup for nested fields:
            // Build a $elemMatch for the array's element schema using meta.subMeta if provided.
            // For generic approach, accept rawVal as parsed query and convert keys by replacing categoryId with field names.
            // Here we accept rawVal as direct Mongo object (for advanced users).
            if (typeof rawVal === "object") {
              opsForPath.push({ type: "op", op: "$elemMatch", value: rawVal });
            } else {
              // if string, attempt JSON parse
              const parsed = safeParseJSON(rawVal);
              if (parsed) {
                opsForPath.push({ type: "op", op: "$elemMatch", value: parsed });
              }
            }
          } else {
            // unsupported operator (skip)
            continue;
          }
        } // end op loop

        // merge opsForPath into subQuery at dbPath
        if (opsForPath.length === 0) continue;

        // If there's a direct replace (eq or regex replace), then replace entire key
        const replaceOp = opsForPath.find(x => x.type === "replace");
        if (replaceOp) {
          // choose last replace if multiple
          subQuery[dbPath] = replaceOp.value;
          // Also merge other ops (like $gte/$lte) into object if both exist
          for (const o of opsForPath) {
            if (o.type === "op") {
              if (typeof subQuery[dbPath] !== "object" || subQuery[dbPath] === null || subQuery[dbPath].$regex) {
                // if currently a scalar (from replace), convert to object to merge ops
                subQuery[dbPath] = Object.assign({}, { $eq: replaceOp.value });
              }
              subQuery[dbPath][o.op] = o.value;
            }
          }
        } else {
          // No replace: produce object with ops
          const opObj = {};
          for (const o of opsForPath) {
            if (o.type === "op") {
              opObj[o.op] = o.value;
            }
          }
          // If opObj is empty due to unsupported ops, skip
          if (Object.keys(opObj).length > 0) {
            subQuery[dbPath] = Object.assign(subQuery[dbPath] || {}, opObj);
          }
        }
      } // end categoryId loop

      return subQuery;
    } // end non-logical object

    // If node is array -> treat as $and of items
    if (Array.isArray(node)) {
      return { $and: node.map(n => transformNode(n)) };
    }

    // default
    return {};
  } // end transformNode

  const mongoQuery = transformNode(parsedFilters);

  // Final cleanup: remove empty objects
  function clean(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(clean).filter(x => (x && (typeof x !== "object" || Object.keys(x).length > 0)));
    const out = {};
    for (const k of Object.keys(obj)) {
      const v = clean(obj[k]);
      if (v === undefined) continue;
      if ((typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)) continue;
      out[k] = v;
    }
    return out;
  }

  return clean(mongoQuery);
}

// --------------------------
// Public API
// --------------------------
/**
 * buildFromRequest(reqQuery, allowedFilters)
 * - reqQuery: req.query (or req.body.query) from express
 * - allowedFilters: array of Filter docs (populated) that this panel is allowed to use.
 *
 * returns: { mongoQuery, parsed }
 */
function buildFromRequest(reqQuery = {}, allowedFilters = []) {
  // 1) If reqQuery.filter exists and is JSON, use it for logical filters
  let parsed = {};
  if (reqQuery.filter) {
    const maybe = (typeof reqQuery.filter === "string") ? safeParseJSON(reqQuery.filter) : reqQuery.filter;
    if (maybe && typeof maybe === "object") {
      parsed = maybe;
    } else {
      // if parsing fails, fallback to simple parsing
      parsed = parseSimpleQueryParams(reqQuery);
    }
  } else {
    parsed = parseSimpleQueryParams(reqQuery);
  }

  const mongoQuery = buildMongoQueryFromParsed(parsed, allowedFilters);
  return { mongoQuery, parsed };
}

module.exports = {
  buildFromRequest,
  parseSimpleQueryParams,
  buildMongoQueryFromParsed,
  castToType: castToType
};
