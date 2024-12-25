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

    if (!userId) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const imageUrl = req.file.path;

    const image = await addImageToPost(postId, userId, imageUrl);

    res.status(201).json({
      message: "Image uploaded successfully.",
      image,
    });
  } catch (error) {
    next(error);
  }
};
