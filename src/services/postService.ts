import { PrismaClient } from "@prisma/client";

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

  return post;
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

  return posts;
};


export const getPostById = async (id: string) => {
  if (!id) {
    throw new Error("Post ID is required.");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { username: true } },
      comments: {
        select: {
          content: true,
          createdAt: true,
          author: { select: { username: true } }, // Include username of the author
        },
      },
      images: true,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  return post;
};

export const updatePost = async (
  id: string,
  title: string,
  content: string,
  authorId: string
) => {
  if (!id || !title || !content || !authorId) {
    throw new Error("All fields (id, title, content, authorId) are required.");
  }

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

  const updatedPost = await prisma.post.updateMany({
    where: { id, authorId },
    data: {
      title,
      content,
    },
  });

  return updatedPost.count > 0 ? await getPostById(id) : null;
};

export const deletePost = async (id: string, authorId: string) => {
  if (!id || !authorId) {
    throw new Error("Post ID and Author ID are required.");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.authorId !== authorId) {
    throw new Error("You are not authorized to delete this post.");
  }

  const deletedPost = await prisma.post.deleteMany({
    where: { id, authorId },
  });

  return deletedPost.count > 0;
};
