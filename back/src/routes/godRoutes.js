const express = require("express");
const router = express.Router();
const { createFilter, getAllFilters, updateFilter, deleteFilter,getDistinctFieldValues,getAllPossibleFields} = require("../controllers/filterController.js");
const { syncSearchableFields,getAllSearchableFields,toggleSearchable ,seedSearchableFields} = require("../controllers/searchableFieldController.js");

// Create a new filter
router.post("/addfilter", createFilter);

// Get all filters
router.get("/allfilter", getAllFilters);

router.get('/searchable-fields/seed',seedSearchableFields)
router.get('/searchable-fields/',getAllSearchableFields)

// Update filter
router.put("/updatefilter/:id", updateFilter);

// Delete filter
router.delete("/deletefilter/:id", deleteFilter);

router.get("/searchable-fields", syncSearchableFields);
router.patch("/searchable-fields/:id", toggleSearchable);


router.get("/distinct-values", getDistinctFieldValues);

router.get('/possible-fields',getAllPossibleFields)


module.exports = router;
