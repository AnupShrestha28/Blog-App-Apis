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
    const userId = req.user?.id || "";
    const result = await createPost(title, content, userId);
    res.status(201).json(result);
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
    const result = await getAllPosts();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPostByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const result = await getPostById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePostHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    const userId = req.user?.id || "";
    const result = await updatePost(id, title, content, userId);
    res.status(200).json(result);
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
    const id = req.params.id;
    const userId = req.user?.id || "";
    const result = await deletePost(id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
