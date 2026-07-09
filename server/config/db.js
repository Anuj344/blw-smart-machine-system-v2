const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("URI:", process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("Full Error:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;