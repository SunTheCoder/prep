import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

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

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
