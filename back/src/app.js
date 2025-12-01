const express = require("express");
const cors = require("cors");
const godRoutes = require("./routes/godRoutes");
const userRoutes = require("./routes/userRoutes");
const panelPermissionRoutes = require("./routes/panelPermissionRoutes");

const app = express();
app.use(express.json());

app.use(
    cors({
      origin: "https://superbasepanel.netlify.app",
    })
);

app.use('/api/god',godRoutes);
app.use("/api/users", userRoutes);
app.use("/api/panel", panelPermissionRoutes);
module.exports = app;
