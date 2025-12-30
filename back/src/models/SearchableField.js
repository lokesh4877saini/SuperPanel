const mongoose = require("mongoose");

const SearchableFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  
  type: {
    type: String,
    enum: ["text", "enum", "number", "date", "phone", "boolean"],
    default: "text"
  },

  // optional normalization
  normalize: {
    type: String,
    enum: ["lowercase", "none"],
    default: "none"
  }
});

module.exports = mongoose.model("SearchableField", SearchableFieldSchema);
