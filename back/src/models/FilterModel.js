const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
  categoryId: String,
  label: String,
  fieldPath: String,
  filterType: String,
  options: [String],
  searchable: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Filter", FilterSchema);
