import { Request, Response, NextFunction } from "express";
import { addImageToPost } from "../services/imageService";

export const uploadImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;
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
