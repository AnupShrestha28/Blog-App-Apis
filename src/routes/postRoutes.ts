import express from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
} from "../controllers/PostController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createPostHandler);

router.get("/", authenticateUser, getAllPostsHandler);

router.get("/:id", authenticateUser, getPostByIdHandler);

router.put("/:id", authenticateUser, updatePostHandler);

router.delete("/:id", authenticateUser, deletePostHandler);

export default router;
