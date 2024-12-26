import express from "express";
import {
  registerUser,
  loginUser,
  deleteUserController,
} from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only route to delete a user
router.delete("/:id", authenticateUser, requireAdmin, deleteUserController);

export default router;
