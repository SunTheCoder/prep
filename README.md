# prep
### **Authentication Controller Documentation**
This document explains how the authentication system works in our **TypeScript Express API**, covering **user registration and login** using **Prisma (PostgreSQL), JWT, and bcrypt**.

---

## **🔹 Overview**
This module provides authentication functionalities:
- **User Registration** (`/register`)
- **User Login** (`/login`)
- **JWT Token-Based Authentication**
- **Secure Password Hashing**
- **Manual Input Validation**

---

## **🔹 Dependencies Used**
| Package        | Purpose |
|---------------|---------|
| `express`     | Web framework for Node.js |
| `bcryptjs`    | Hashing passwords securely |
| `jsonwebtoken` | Generating & verifying JWT tokens |
| `@prisma/client` | ORM for PostgreSQL database |
| `cookie-parser` | Storing JWT in secure cookies (optional) |

---

## **🔹 Environment Variables**
| Variable       | Description |
|---------------|-------------|
| `JWT_SECRET`  | Secret key for signing JWT tokens |
| `DATABASE_URL` | PostgreSQL connection string |

📌 **Ensure you define these in your `.env` file** before running the server.

---

# **1️⃣ Register User**
### **🔹 Endpoint:**
```http
POST /api/auth/register
```
### **🔹 Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```
### **🔹 Response (Success)**
```json
{
  "message": "User registered successfully",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```
### **🔹 Response (Errors)**
| Status Code | Message |
|------------|----------|
| `400` | Name must be at least 2 characters |
| `400` | Invalid email format |
| `400` | Password must be at least 6 characters |
| `500` | Internal Server Error |

### **🔹 Implementation**
```ts
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Manual validation
    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash password before storing in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in PostgreSQL using Prisma
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

---

# **2️⃣ Login User**
### **🔹 Endpoint:**
```http
POST /api/auth/login
```
### **🔹 Request Body (JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```
### **🔹 Response (Success)**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1..."
}
```
### **🔹 Response (Errors)**
| Status Code | Message |
|------------|----------|
| `400` | Invalid email format |
| `400` | Password must be at least 6 characters |
| `401` | Invalid credentials |
| `500` | Internal Server Error |

### **🔹 Implementation**
```ts
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Manual validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: "1h" });

    // Secure cookie storage
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

---

# **3️⃣ JWT-Based Authentication**
### **How JWT Works**
1. **User Logs In** → Receives a **JWT token**.
2. **Token is Sent in Requests** → Stored in **cookies** or sent via `Authorization` headers.
3. **Protected Routes Verify Token** → Only authenticated users can access them.

### **🔹 Middleware for Protecting Routes**
```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

---

# **4️⃣ Logout User**
### **🔹 Endpoint:**
```http
POST /api/auth/logout
```
### **🔹 Response**
```json
{
  "message": "Logout successful"
}
```

### **🔹 Implementation**
```ts
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ message: "Logout successful" });
};
```

---

# **🔹 Summary of API Routes**
| HTTP Method | Endpoint | Description | Middleware |
|------------|----------|-------------|------------|
| `POST` | `/api/auth/register` | Register a new user | None |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | None |
| `POST` | `/api/auth/logout` | Clear authentication token | None |
| `GET` | `/api/protected` | Example protected route | `authMiddleware` |

---


✅ What You Mastered
TypeScript Express Backend
JWT Authentication & Secure Cookies
User Registration, Login, and Deletion
Redux Toolkit for Authentication Management
Fetching and Managing Users in React
Debugging CORS & API Route Issues
Proper Backend & Frontend Integration
