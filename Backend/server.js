// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ override: true });

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// Database
// --------------------
connectDB();

// --------------------
// Security & Middleware
// --------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Allow localhost + ALL Vercel preview URLs safely
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// --------------------
// Static uploads (if used)
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// API Routes (CONSISTENT)
// --------------------
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// --------------------
// Health & Root (IMPORTANT)
// --------------------
app.get("/", (req, res) => {
  res.json({
    name: "Trimurti Fabrication Backend",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// --------------------
// 404 Handler (LAST)
// --------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
