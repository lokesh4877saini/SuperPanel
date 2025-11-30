const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
// Make sure getUsers is imported correctly
router.get("/", getUsers);


module.exports = router;
