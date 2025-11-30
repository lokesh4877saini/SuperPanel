// models/PanelSearchableField.js
const mongoose = require("mongoose");

const PanelSearchableFieldSchema = new mongoose.Schema({
  panel: { type: String, required: true, unique: true },
  searchableFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "SearchableField" }]
});

module.exports = mongoose.model("PanelSearchableField", PanelSearchableFieldSchema);
