import { Request, Response } from "express";
import { createComment, getCommentsByPostId } from "../services/commentService";

export const createCommentHandler = async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;
  const { user } = req; 

  try {
    if (!user) throw new Error("User not authenticated.");
    const comment = await createComment(content, postId, user.id);
    res.status(201).json(comment);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
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
