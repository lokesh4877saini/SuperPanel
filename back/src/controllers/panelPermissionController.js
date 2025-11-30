const PanelPermission = require("../models/PanelPermission");

// Get filters allowed for a panel
exports.getPanelFilters = async (req, res) => {
  try {
    const { panel } = req.params;

    const permission = await PanelPermission.findOne({ panel })
      .populate("allowedFilters");

    if (!permission) {
      return res.json({ allowedFilters: [] });
    }

    res.json({
      allowedFilters: permission.allowedFilters
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.updatePanelFilters = async (req, res) => {
  const { panel } = req.params;
  const { allowedFilters } = req.body;

  let record = await PanelPermission.findOne({ panel });
  if (!record) {
    record = new PanelPermission({ panel, allowedFilters });
  } else {
    record.allowedFilters = allowedFilters;
  }
  await record.save();
  res.json(record);
};
