const mongoose = require("mongoose");

const PanelPermissionSchema = new mongoose.Schema({
  panel: { type: String, unique: true },
  allowedFilters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filter" }]
});

module.exports = mongoose.model("PanelPermission", PanelPermissionSchema);
