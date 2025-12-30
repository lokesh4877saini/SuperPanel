// controllers/userController.js
const User = require("../models/User");
const PanelPermission = require("../models/PanelPermission");
const PanelSearchableField = require("../models/PanelSearchableField");
const queryBuilder = require("../utils/queryBuilder");
const buildSearchOrConditions = require('../utils/buildSearchQuery');
exports.getUsers = async (req, res) => {
  try {
    const panel = req.query.panel || "admin";

    // 1) Load allowed filters for this panel
    const permission = await PanelPermission.findOne({ panel }).populate("allowedFilters");
    const allowedFilters = permission ? permission.allowedFilters : [];

    // 2) Load panel-level searchable fields
    const panelFieldDoc = await PanelSearchableField
      .findOne({ panel })
      .populate("enabledFields"); // <-- populate field name
    const panelSearchableFields = panelFieldDoc ? panelFieldDoc.enabledFields : [];

    // Convert fields to actual paths
    const finalSearchableFields = panelSearchableFields.map(f => f.path);
    // console.log(finalSearchableFields, "Fields that need to search");
    // console.log(allowedFilters, "God Panel Allowed things")
    // 3) Build base query from allowed filters
    const { mongoQuery, parsed } = queryBuilder.buildFromRequest(req.query, allowedFilters);

    // 4) Handle search logic
    const searchValue = req.query.search?.trim();

    if (searchValue) {
      const orConditions = buildSearchOrConditions(
        searchValue,
        panelSearchableFields
      );

      // console.log(orConditions, "orConditions");

      if (orConditions.length) {
        mongoQuery.$or = orConditions;
      }
    }
    // 5) Pagination
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "50", 10));
    const skip = (page - 1) * limit;
    // console.log("FINAL MONGO QUERY:", JSON.stringify(mongoQuery, null, 2));

    let cursor = User.find(mongoQuery).skip(skip).limit(limit);

    // 6) Sorting
    if (req.query.sort) {
      const order = req.query.order === "desc" ? -1 : 1;
      cursor = cursor.sort({ [req.query.sort]: order });
    }

    const totalCount = await User.countDocuments({});
    const count = await User.countDocuments(mongoQuery);
    const results = await cursor.exec();

    // 7) Response
    res.json({
      meta: {
        count,
        page,
        totalCount,
        limit,
        parsed,
        searchablePaths: finalSearchableFields,
        panelSearchableFields
      },
      data: results
    });

  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
