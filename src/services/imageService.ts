import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const addImageToPost = async (
  postId: string,
  userId: string,
  file: Express.Multer.File | undefined
) => {
  try {
    validateUUID(postId);

    if (!file) {
      throw new Error("No file uploaded.");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== userId) {
      throw new Error(
        "You are not allowed to upload an image to someone else's blog post."
      );
    }

    const image = await prisma.image.create({
      data: {
        imageUrl: file.path,
        postId,
      },
    });

    return image;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred."
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
      throw new Error("No file uploaded.");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== userId) {
      throw new Error(
        "You are not allowed to update an image for someone else's blog post."
      );
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image || image.postId !== postId) {
      throw new Error(
        "Image not found or does not belong to the specified post."
      );
    }

    const oldImagePath = path.resolve(image.imageUrl);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: {
        imageUrl: file.path,
      },
    });

    return updatedImage;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred."
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

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== userId) {
      throw new Error(
        "You are not allowed to delete an image from someone else's blog post."
      );
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image || image.postId !== postId) {
      throw new Error(
        "Image not found or does not belong to the specified post."
      );
    }

    const imagePath = path.resolve(image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.image.delete({
      where: { id: imageId },
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred."
    );
  }
};
