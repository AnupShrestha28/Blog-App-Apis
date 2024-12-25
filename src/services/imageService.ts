import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addImageToPost = async (postId: string, imageUrl: string) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new Error("Post not found.");
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
