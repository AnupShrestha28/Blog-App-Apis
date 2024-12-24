import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  createCommentHandler,
  getCommentsHandler,
} from "../controllers/CommentController";

const router = express.Router();

// Comment Routes
router.post("/:postId/comments", authenticateUser, createCommentHandler);

router.get("/:postId/comments", authenticateUser, getCommentsHandler);

export default router;
