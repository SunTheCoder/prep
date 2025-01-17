import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from './routes/auth.routes'

dotenv.config();

const app = express();

/**
 * Middleware Configuration
 * ------------------------
 * This section includes essential middleware functions
 * for handling security, request parsing, logging, and CORS.
 */

// Enable Cross-Origin Resource Sharing (CORS) to allow frontend requests
app.use(cors());

/**
 * Parse incoming JSON requests.
 * Example: 
 * Request Body -> { "name": "John" }
 * Accessible via req.body.name
 */
app.use(express.json());

/**
 * Parse URL-encoded data from forms.
 * - `extended: true` allows parsing of nested objects.
 * Example:
 * key1=value1&key2[value3]=value4
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Parse cookies from incoming requests.
 * Example:
 * Cookie: user_session=abc123;
 * Accessible via req.cookies.user_session
 */
app.use(cookieParser());

/**
 * Apply security-related HTTP headers.
 * Helps prevent attacks like cross-site scripting (XSS), clickjacking, etc.
 */
app.use(helmet());

/**
 * HTTP request logging for debugging.
 * Logs details like request method, status code, and response time.
 */
app.use(morgan("dev"));

// ==============================
// 🚀 Security: Rate Limiting Middleware
// ==============================

// Import `express-rate-limit` to prevent excessive requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (time window for rate limit)
  max: 100, // Limit each IP to 100 requests per 15 minutes
});

// Apply the rate limiter to all incoming requests
// Helps prevent DDoS attacks and abuse
app.use(limiter);

// ==============================
// 📌 Route Registration
// ==============================

// Mount authentication routes under `/api/auth`
// Example: `/api/auth/register`, `/api/auth/login`, etc.
app.use("/api/auth", authRoutes);

// ==============================
// 🌍 Basic Health Check Route
// ==============================

// Simple GET route to confirm the API is running
// Example: Visiting `http://localhost:3001/` should return { "message": "API is running!" }
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// ==============================
// 🎯 Start the Express Server
// ==============================

// Set the port dynamically from environment variables, or default to 3001
const PORT = process.env.PORT || 3001;

// Start the server and listen for incoming requests
// Logs a message in the console to confirm the server is running
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
