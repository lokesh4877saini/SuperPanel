const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

app.listen(5000, () => console.log("Server running on port 5000"));
