import { Request, Response } from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../services/commentService";

export const createCommentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;
    const user = req.user;

    const result = await createComment(comment, postId, user?.id);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the comment.",
    });
  }
};

export const getCommentsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const result = await getCommentsByPostId(postId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching comments.",
    });
  }
};

export const updateCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user!.id;

    const result = await updateComment(id, comment, userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the comment.",
    });
  }
};

export const deleteCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await deleteComment(id, userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the comment.",
    });
  }
};
