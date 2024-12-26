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

    const newComment = await createComment(comment, postId, user?.id);
    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Error creating comment.",
    });
  }
};

export const getCommentsHandler = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await getCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const updateCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user?.id;
    const updatedComment = await updateComment(id, comment, userId!);
    res.status(200).json(updatedComment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const deleteCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    await deleteComment(id, userId!);
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};
