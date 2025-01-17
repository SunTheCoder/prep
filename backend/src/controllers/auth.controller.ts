import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

// ✅ Register User
export const register = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Manual validation
    if (!name || name.length < 2) {
      res.status(400).json({ message: "Name must be at least 2 characters" });
      return
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      res.status(400).json({ message: "Invalid email format" });
      return
    }
    if (!password || password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Login User
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Manual validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      res.status(400).json({ message: "Invalid email format" });
      return
    }
    if (!password || password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Secure cookie storage
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ 
                message: "Login successful", 
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  createdAt: user.createdAt
                },
                token 
            });
  } catch (error) {
    next(error)
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true}
    })

    res.json(users)
  } catch (error) {
    console.error("Error fetching users")
    res.status(500).json({message: "Internal Server Error"})
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params

      // 🔹 Check if the user exists
      const user = await prisma.user.findUnique({ where: {id}});
      if (!user) {
        res.status(400).json({message: 'User not found'});
        return
      }

      await prisma.user.delete({where: {id}})

      res.json({message: "User deleted successfully", userID: id})
   } catch (error) {
      console.error("Delete user error!")
      res.status(500).json({message: "Internal Server Error"})
   }
}