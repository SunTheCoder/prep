import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Load the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Define a custom interface extending the default Express Request object
// This allows us to attach a `user` property to `req` for later use
interface CustomRequest extends Request {
  user?: any; // Replace `any` with a defined User type if available
}

/**
 * Authentication Middleware
 *
 * This middleware checks for a valid JWT token in either:
 * - Cookies (`req.cookies.token`)
 * - Authorization header (`Authorization: Bearer <token>`)
 *
 * If a valid token is found:
 * - It is verified using `jsonwebtoken`
 * - The decoded user data is attached to `req.user`
 * - The request proceeds to the next middleware/controller
 *
 * If no token is provided or verification fails:
 * - A 401 Unauthorized response is sent
 */
export const authMiddleware = (
  req: CustomRequest, 
  res: Response, 
  next: NextFunction
) => {
  // Extract token from either cookies or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Adjust based on JWT payload structure

    // Attach decoded user data to request object
    req.user = decoded; 

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If verification fails, return a 401 Unauthorized response
    return res.status(401).json({ message: "Invalid token" });
  }
};
