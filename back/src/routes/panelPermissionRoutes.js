const express = require("express");
const router = express.Router();

const { getPanelFilters,updatePanelFilters } = require("../controllers/panelPermissionController");

router.get("/:panel/filters", getPanelFilters);
router.post("/:panel/filters", updatePanelFilters);
module.exports = router;
