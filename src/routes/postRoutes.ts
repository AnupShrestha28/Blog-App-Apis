import express from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
} from "../controllers/PostController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createPostHandler);

router.get("/", authenticateUser, getAllPostsHandler);

router.get("/:id", authenticateUser, getPostByIdHandler);

export default router;
