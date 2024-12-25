import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addImageToPost = async (
  postId: string,
  userId: string,
  imageUrl: string
) => {
  try {
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
        imageUrl,
        postId,
      },
    });

    return image;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error uploading image."
    );
  }
};
