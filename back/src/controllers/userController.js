// controllers/userController.js
const User = require("../models/User");
const PanelPermission = require("../models/PanelPermission");
const SearchableField = require("../models/SearchableField");
const queryBuilder = require("../utils/queryBuilder");

exports.getUsers = async (req, res) => {
  try {
    const panel = req.query.panel || "admin";

    // 1) Load PanelPermission and allowed filters
    const permission = await PanelPermission.findOne({ panel }).populate("allowedFilters");
    const allowedFilters = permission ? permission.allowedFilters : [];

    // 2) Build mongo query from request filters
    const { mongoQuery, parsed } = queryBuilder.buildFromRequest(req.query, allowedFilters);

    // 3) Get all fields that are globally searchable
    const searchableFieldsDocs = await SearchableField.find({ isSearchable: true });
    const searchableFields = searchableFieldsDocs.map(f => f.path);

    // 4) Global search
    const searchValue = req.query.search?.trim();
    if (searchValue && searchableFields.length > 0) {
      const orQueries = [];

      searchableFields.forEach(fieldPath => {
        if (fieldPath.includes("phone") && /^\d+$/.test(searchValue)) {
          // Numeric fields like phone → exact match
          orQueries.push({ [fieldPath]: searchValue });
        } else {
          // String fields → case-insensitive partial match
          orQueries.push({ [fieldPath]: { $regex: searchValue, $options: "i" } });
        }
      });

      if (orQueries.length > 0) {
        mongoQuery.$or = orQueries;
      }
    }

    // 5) Pagination & sorting
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "50", 10));
    const skip = (page - 1) * limit;

    let cursor = User.find(mongoQuery).skip(skip).limit(limit);

    // 6) query what applied sorting
    if (req.query.sort) {
      const order = req.query.order === "desc" ? -1 : 1;
      const sortObj = { [req.query.sort]: order };
      cursor = cursor.sort(sortObj);
    }

    const totalCount = await User.countDocuments({});
    const count = await User.countDocuments(mongoQuery);
    const results = await cursor.exec();

    res.json({
      meta: { count, page, totalCount, limit, parsed },
      data: results
    });

  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
