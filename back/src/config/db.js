const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error(" Missing MONGO_URI in environment variables");
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
