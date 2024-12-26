import { Request, Response, NextFunction } from "express";
import {
  addImageToPost,
  deleteImageFromPost,
  updateImageForPost,
} from "../services/imageService";

export const uploadImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = (req.user as any).id;
    const file = req.file;

    const response = await addImageToPost(postId, userId, file);

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId, imageId } = req.params;
    const userId = (req.user as any).id;
    const file = req.file;

    const response = await updateImageForPost(postId, imageId, userId, file);

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId, imageId } = req.params;
    const userId = (req.user as any).id;

    const response = await deleteImageFromPost(postId, imageId, userId);

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
