const SearchableField = require("../models/SearchableField");
const PanelSearchableField = require("../models/PanelSearchableField");
const extractPaths = require("../utils/getSchemaPaths");
const User = require("../models/User");

// Sync all fields into SearchableField collection
exports.syncSearchableFields = async (req, res) => {
  try {
    const paths = extractPaths(User.schema);

    for (const p of paths) {
      await SearchableField.updateOne(
        { path: p.path },
        { $setOnInsert: { label: p.path.split(".").slice(-1)[0], type: p.type } },
        { upsert: true }
      );
    }

    const all = await SearchableField.find().sort({ path: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all searchable fields (show table) with panel-specific enabled status
exports.getAllSearchableFields = async (req, res) => {
  try {
    const panel = req.query.panel;

    const fields = await SearchableField.find().sort({ path: 1 });

    if (!panel) {
      return res.json(fields); // no panel → return global list only
    }

    const panelConfig = await PanelSearchableField.findOne({ panel });

    const enabled = panelConfig?.enabledFields.map(id => id.toString()) || [];

    const result = fields.map(f => ({
      ...f.toObject(),
      isSearchable: enabled.includes(f._id.toString()) // computed per panel
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Toggle searchable field for a specific panel
const mongoose = require("mongoose");

exports.updateGlobalSearchable = async (req, res) => {
  try {
    const { panel } = req.body;
    const fieldId = req.params.id;

    if (!panel) {
      return res.status(400).json({ message: "Panel is required" });
    }

    const fieldObjectId = new mongoose.Types.ObjectId(fieldId);

    let panelConfig = await PanelSearchableField.findOne({ panel });

    if (!panelConfig) {
      panelConfig = await PanelSearchableField.create({
        panel,
        enabledFields: []
      });
    }

    const idx = panelConfig.enabledFields.findIndex(
      id => id.toString() === fieldObjectId.toString()
    );
      // console.log("idx"+idx+"toggle")
    if (idx >= 0) {
      // DISABLE
      panelConfig.enabledFields.splice(idx, 1);
    } else {
      // ENABLE (prevent duplicates)
      panelConfig.enabledFields.push(fieldObjectId);
    }

    await panelConfig.save();

    res.json({
      fieldId,
      isSearchable: idx === -1,
      panel
    });

  } catch (err) {
    console.error("updateGlobalSearchable error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Auto insert missing fields into SearchableField collection
exports.seedSearchableFields = async (req, res) => {
  try {
    const allPaths = extractPaths(User.schema);

    for (const p of allPaths) {
      try {
        const exists = await SearchableField.findOne({ path: p.path });
        if (!exists) {
          await SearchableField.create({
            label: p.path.split(".").slice(-1)[0],
            path: p.path,
            type: p.type,
          });
        }
      } catch (innerErr) {
        console.error("INNER ERROR for path:", p.path, innerErr);
      }
    }

    res.json({ message: "Searchable fields synced successfully." });
  } catch (err) {
    console.error("MAIN ERROR:", err);
    res.status(500).json({ message: "Error while seeding searchable fields", error: err.message });
  }
};
