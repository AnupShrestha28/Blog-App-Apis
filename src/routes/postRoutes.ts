import express from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
} from "../controllers/postController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Post Routes
router.post("/", authenticateUser, createPostHandler);

router.get("/", authenticateUser, getAllPostsHandler);

router.get("/:id", authenticateUser, getPostByIdHandler);

router.put("/:id", authenticateUser, updatePostHandler);

router.delete("/:id", authenticateUser, deletePostHandler);

export default router;
