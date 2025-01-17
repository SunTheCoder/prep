import express from "express";
import { register, login, deleteUser, getAllUsers } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers); // ✅ Get all users
router.delete("/:id", deleteUser)

export default router;
