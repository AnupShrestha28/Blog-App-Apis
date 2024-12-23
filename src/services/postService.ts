import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (
  title: string,
  content: string,
  authorId: string
) => {
  // Validate input
  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  if (title.length < 10) {
    throw new Error("Title must be at least 10 characters long.");
  }

  if (content.length < 20) {
    throw new Error("Content must be at least 20 characters long.");
  }

  // Check if a post with the same title already exists
  const existingPost = await prisma.post.findUnique({
    where: { title },
  });

  if (existingPost) {
    throw new Error("A post with the same title already exists.");
  }

  // Create the post
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

  return post;
};

export const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, username: true } },
      comments: true,
      images: true,
    },
  });

  return posts;
};

export const getPostById = async (id: string) => {
  // Validate input
  if (!id) {
    throw new Error("Post ID is required.");
  }

  // Check if the post exists
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true } },
      comments: true,
      images: true,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  return post;
};
