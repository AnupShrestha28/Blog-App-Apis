import { Request, Response } from "express";
import { createComment, getCommentsByPostId } from "../services/commentService";

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
