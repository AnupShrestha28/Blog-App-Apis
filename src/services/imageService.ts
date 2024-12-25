import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const addImageToPost = async (
  postId: string,
  userId: string | undefined,
  file: Express.Multer.File | undefined
) => {
  try {
    validateUUID(postId);

    if (!userId) {
      throw new Error("Unauthorized. Please log in.");
    }

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
