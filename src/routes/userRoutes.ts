import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile Management
router.get("/profile", authenticateUser, getUserProfile);

export default router;
