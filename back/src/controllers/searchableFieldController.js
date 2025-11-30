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
    const panel = req.query.panel || null;
    const allFields = await SearchableField.find().sort({ path: 1 });

    if (!panel) return res.json(allFields);

    const panelFields = await PanelSearchableField.findOne({ panel });
    const enabledIds = panelFields?.searchableFields.map(f => f.toString()) || [];

    const result = allFields.map(f => ({
      ...f.toObject(),
      isSearchable: enabledIds.includes(f._id.toString())
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle searchable field for a specific panel
exports.toggleSearchable = async (req, res) => {
  try {
    const { panel } = req.body; // pass panel in request body
    const fieldId = req.params.id;

    if (!panel) return res.status(400).json({ message: "Panel is required" });

    let panelFields = await PanelSearchableField.findOne({ panel });
    if (!panelFields) {
      panelFields = await PanelSearchableField.create({ panel, searchableFields: [] });
    }

    const index = panelFields.searchableFields.findIndex(f => f.equals(fieldId));
    if (index > -1) {
      panelFields.searchableFields.splice(index, 1); // disable
    } else {
      panelFields.searchableFields.push(fieldId); // enable
    }

    await panelFields.save();

    // Return updated field for frontend
    const updatedField = await SearchableField.findById(fieldId);
    res.json({ ...updatedField.toObject(), isSearchable: index === -1 });
  } catch (err) {
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
            isSearchable: false
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
