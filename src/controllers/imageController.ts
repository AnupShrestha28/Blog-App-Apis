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

    const image = await addImageToPost(postId, userId, file);

    res.status(201).json({
      message: "Image uploaded successfully.",
      image,
    });
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

    const updatedImage = await updateImageForPost(
      postId,
      imageId,
      userId,
      file
    );

    res.status(200).json({
      message: "Image updated successfully.",
      image: updatedImage,
    });
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

    await deleteImageFromPost(postId, imageId, userId);

    res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
