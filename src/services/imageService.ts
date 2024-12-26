import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

const createResponse = (
  success: boolean,
  message: string,
  data: any = null,
  statusCode: number = 200
) => ({
  success,
  message,
  data,
  statusCode,
});

export const addImageToPost = async (
  postId: string,
  userId: string,
  file: Express.Multer.File | undefined
) => {
  try {
    validateUUID(postId);

    if (!file) {
      return createResponse(false, "No file uploaded.", null, 400);
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return createResponse(false, "Post not found.", null, 404);
    }

    if (post.authorId !== userId) {
      return createResponse(
        false,
        "You are not allowed to upload an image to someone else's blog post.",
        null,
        403
      );
    }

    const image = await prisma.image.create({
      data: {
        imageUrl: file.path,
        postId,
      },
    });

    return createResponse(true, "Image uploaded successfully.", image, 201);
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error ? error.message : "An error occurred.",
      null,
      500
    );
  }
};

export const updateImageForPost = async (
  postId: string,
  imageId: string,
  userId: string,
  file: Express.Multer.File | undefined
) => {
  try {
    validateUUID(postId);
    validateUUID(imageId);

    if (!file) {
      return createResponse(false, "No file uploaded.", null, 400);
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return createResponse(false, "Post not found.", null, 404);
    }

    if (post.authorId !== userId) {
      return createResponse(
        false,
        "You are not allowed to update an image for someone else's blog post.",
        null,
        403
      );
    }

    const image = await prisma.image.findUnique({ where: { id: imageId } });

    if (!image || image.postId !== postId) {
      return createResponse(
        false,
        "Image not found or does not belong to the specified post.",
        null,
        404
      );
    }

    const oldImagePath = path.resolve(image.imageUrl);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { imageUrl: file.path },
    });

    return createResponse(
      true,
      "Image updated successfully.",
      updatedImage,
      200
    );
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error ? error.message : "An error occurred.",
      null,
      500
    );
  }
};

export const deleteImageFromPost = async (
  postId: string,
  imageId: string,
  userId: string
) => {
  try {
    validateUUID(postId);
    validateUUID(imageId);

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return createResponse(false, "Post not found.", null, 404);
    }

    if (post.authorId !== userId) {
      return createResponse(
        false,
        "You are not allowed to delete an image from someone else's blog post.",
        null,
        403
      );
    }

    const image = await prisma.image.findUnique({ where: { id: imageId } });

    if (!image || image.postId !== postId) {
      return createResponse(
        false,
        "Image not found or does not belong to the specified post.",
        null,
        404
      );
    }

    const imagePath = path.resolve(image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.image.delete({ where: { id: imageId } });

    return createResponse(true, "Image deleted successfully.", null, 200);
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error ? error.message : "An error occurred.",
      null,
      500
    );
  }
};
