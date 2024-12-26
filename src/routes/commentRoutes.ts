import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  createCommentHandler,
  getCommentsHandler,
  updateCommentController,
  deleteCommentController,
} from "../controllers/commentController";

const router = express.Router();

// Comment Routes
router.post("/:postId/comments", authenticateUser, createCommentHandler);

router.get("/:postId/comments", authenticateUser, getCommentsHandler);

// User can update their own comment
router.patch("/update/:id", authenticateUser, updateCommentController);

// User can delete their own comment
router.delete("/delete/:id", authenticateUser, deleteCommentController);

export default router;
