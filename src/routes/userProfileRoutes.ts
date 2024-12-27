import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Profiles
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve user profile
 *     tags: [User Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticateUser, getUserProfile);

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated user profile
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.patch("/profile", authenticateUser, updateUserProfile);

export default router;
