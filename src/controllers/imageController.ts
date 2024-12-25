import { Request, Response, NextFunction } from "express";
import { addImageToPost } from "../services/imageService";

export const uploadImageHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const imageUrl = req.file.path;

    // Save image details in the database
    const image = await addImageToPost(postId, imageUrl);

    res.status(201).json({
      message: "Image uploaded successfully.",
      image,
    });
  } catch (error) {
    next(error); // Pass the error to the Express error handler
  }
};
