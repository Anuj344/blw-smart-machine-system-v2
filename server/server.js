const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
console.log("MONGO_URI =", process.env.MONGO_URI);

const machineRoutes = require("./routes/machineRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("🚆 BLW Machine Information API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server Running on http://10.249.218.161:${PORT}`);
});