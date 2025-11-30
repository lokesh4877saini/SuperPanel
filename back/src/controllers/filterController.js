const Filter = require("../models/FilterModel");
const User = require('../models/User')
const extractPaths = require("../utils/getSchemaPaths");

// Create a new filter
exports.createFilter = async (req, res) => {
  try {
    const { categoryId, label, fieldPath, filterType, options } = req.body;

    // Optional: prevent duplicate filter in same category + field
    const exists = await Filter.findOne({ categoryId, fieldPath });
    if (exists) {
      return res.status(400).json({ message: "Filter already exists" });
    }

    const filter = new Filter({
      categoryId,
      label,
      fieldPath,
      filterType,
      options: options || [],
      enabled: true
    });

    await filter.save();
    res.status(201).json(filter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all filters
exports.getAllFilters = async (req, res) => {
  try {
    const filters = await Filter.find();
    res.json(filters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a filter
exports.updateFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const filter = await Filter.findByIdAndUpdate(id, updatedData, { new: true });
    if (!filter) return res.status(404).json({ message: "Filter not found" });

    res.json(filter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a filter
exports.deleteFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = await Filter.findByIdAndDelete(id);
    if (!filter) return res.status(404).json({ message: "Filter not found" });

    res.json({ message: "Filter deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getDistinctFieldValues = async (req, res) => {
  try {
    const { fieldPath } = req.query;
    if (!fieldPath) return res.status(400).json({ message: "fieldPath is required" });

    const values = await User.distinct(fieldPath);
    res.json(values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPossibleFields = async (req, res) => {
  const paths = extractPaths(User.schema);
  res.json(paths); 
};
