import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const createPost = async (
  title: string,
  content: string,
  authorId: string
) => {
  try {
    if (!title || !content) throw new Error("Title and content are required.");
    if (title.length < 10)
      throw new Error("Title must be at least 10 characters.");
    if (content.length < 20)
      throw new Error("Content must be at least 20 characters.");

    const existingPost = await prisma.post.findUnique({ where: { title } });
    if (existingPost)
      throw new Error("A post with the same title already exists.");

    const post = await prisma.post.create({
      data: { title, content, authorId },
      include: { author: { select: { id: true, username: true } } },
    });

    return {
      success: true,
      statusCode: 201,
      message: "Blog post has been created successfully.",
      data: post,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error instanceof Error ? 400 : 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};

export const getAllPosts = async () => {
  try {
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

    return {
      success: true,
      statusCode: 200,
      message: "All Blog posts have been retrieved.",
      data: posts,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error instanceof Error ? 400 : 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};

export const getPostById = async (id: string) => {
  try {
    if (!id) throw new Error("Post ID is required.");
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

    if (!post) throw new Error("Post not found.");

    return {
      success: true,
      statusCode: 200,
      message: `${post.author.username}'s blog has been retrieved.`,
      data: post,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error instanceof Error ? 400 : 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};

export const updatePost = async (
  id: string,
  title: string,
  content: string,
  authorId: string
) => {
  try {
    if (!id || !title || !content || !authorId)
      throw new Error(
        "All fields (id, title, content, authorId) are required."
      );

    validateUUID(id);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error("Post not found.");
    if (post.authorId !== authorId)
      throw new Error("You are not authorized to update this post.");
    if (title.length < 10)
      throw new Error("Title must be at least 10 characters.");
    if (content.length < 20)
      throw new Error("Content must be at least 20 characters.");

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    return {
      success: true,
      statusCode: 200,
      message: "Blog post has been updated successfully.",
      data: updatedPost,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error instanceof Error ? 400 : 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};

export const deletePost = async (id: string, authorId: string) => {
  try {
    if (!id || !authorId)
      throw new Error("Post ID and Author ID are required.");

    validateUUID(id);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error("Post not found.");
    if (post.authorId !== authorId)
      throw new Error("You are not authorized to delete this post.");

    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });

    return {
      success: true,
      statusCode: 200,
      message: "Blog post and its comments have been deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error instanceof Error ? 400 : 500,
      message:
        error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
