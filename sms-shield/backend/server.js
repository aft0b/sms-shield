const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

// Load .env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// ✅ IMPORT AND USE ROUTE
const protectRoute = require('./routes/protectRoute');
app.use('/api/protect', protectRoute); // ← Required for frontend call

// Optional test route
app.get("/", (req, res) => {
  res.send("API running");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
