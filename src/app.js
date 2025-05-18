const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // << Add this
const authRoutes = require("./routes/auth.routes");

const app = express();

// Allowlisted origins (support multiple dev environments + production)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "https://expressjs-auth.onrender.com",
];

// Dynamic CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Important to allow httpOnly cookies
};

app.use(cors(corsOptions));
app.use(cookieParser()); // << Add this BEFORE routes

// Parse incoming JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
