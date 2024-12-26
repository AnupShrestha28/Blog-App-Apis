import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Profile Management
router.get("/profile", authenticateUser, getUserProfile);
router.patch("/profile", authenticateUser, updateUserProfile);

export default router;
