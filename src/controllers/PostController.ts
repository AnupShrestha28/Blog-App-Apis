import { Request, Response } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../services/postService";

export const createPostHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const post = await createPost(title, content, userId);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPostsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPostByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePostHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title && !content) {
      res
        .status(400)
        .json({ message: "Title or content is required for update." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedPost = await updatePost(id, title, content, userId);
    if (!updatedPost) {
      res.status(404).json({ message: "Post not found or unauthorized" });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePostHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const deletedPost = await deletePost(id, userId);
    if (!deletedPost) {
      res.status(404).json({ message: "Post not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
