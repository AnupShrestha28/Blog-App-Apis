import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const createPost = async (
  title: string,
  content: string,
  authorId: string
) => {
  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  if (title.length < 10) {
    throw new Error("Title must be at least 10 characters long.");
  }

  if (content.length < 20) {
    throw new Error("Content must be at least 20 characters long.");
  }

  const existingPost = await prisma.post.findUnique({
    where: { title },
  });

  if (existingPost) {
    throw new Error("A post with the same title already exists.");
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  return { message: "Blog post has been created successfully", post };
};

export const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      comments: {
        select: {
          content: true,
          createdAt: true,
          author: { select: { username: true } },
        },
      },
      images: true,
    },
  });

  return { message: "All Blog posts have been retrieved", posts };
};

export const getPostById = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required.");
    }

    validateUUID(id);

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        comments: {
          select: {
            content: true,
            createdAt: true,
            author: { select: { username: true } },
          },
        },
        images: true,
      },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    return {
      message: `${post.author.username}'s blog has been retrieved`,
      post,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error fetching the post."
    );
  }
};

export const updatePost = async (
  id: string,
  title: string,
  content: string,
  authorId: string
) => {
  try {
    if (!id || !title || !content || !authorId) {
      throw new Error(
        "All fields (id, title, content, authorId) are required."
      );
    }

    validateUUID(id);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== authorId) {
      throw new Error("You are not authorized to update this post.");
    }

    if (title.length < 10) {
      throw new Error("Title must be at least 10 characters long.");
    }

    if (content.length < 20) {
      throw new Error("Content must be at least 20 characters long.");
    }

    const existingPostWithTitle = await prisma.post.findUnique({
      where: { title },
    });

    if (existingPostWithTitle) {
      throw new Error("A post with the same title already exists.");
    }

    const updatedPost = await prisma.post.updateMany({
      where: { id, authorId },
      data: {
        title,
        content,
      },
    });

    return updatedPost.count > 0
      ? { message: "Blog post has been updated successfully." }
      : null;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating the post."
    );
  }
};

export const deletePost = async (id: string, authorId: string) => {
  try {
    if (!id || !authorId) {
      throw new Error("Post ID and Author ID are required.");
    }

    validateUUID(id);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== authorId) {
      throw new Error("You are not authorized to delete this post.");
    }

    await prisma.comment.deleteMany({
      where: { postId: id },
    });

    const deletedPost = await prisma.post.deleteMany({
      where: { id, authorId },
    });

    return deletedPost.count > 0;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting the post."
    );
  }
};
