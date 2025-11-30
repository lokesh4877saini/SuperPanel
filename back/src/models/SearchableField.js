const mongoose = require("mongoose");

const SearchableFieldSchema = new mongoose.Schema({
    label: String,   // Example: "Phone"
    path: String,    // Example: "basic_info.phone"
    type: String,    // string, number, boolean
    isSearchable: { type: Boolean, default: false }
});

module.exports = mongoose.model("SearchableField", SearchableFieldSchema);
