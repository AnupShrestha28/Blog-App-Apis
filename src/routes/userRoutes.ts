import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile Management
router.get("/profile", authenticateUser, getUserProfile);
router.patch("/profile", authenticateUser, updateUserProfile);

export default router;
