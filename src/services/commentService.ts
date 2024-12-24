import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const createComment = async (
  comment: string,
  postId: string,
  authorId?: string
) => {
  if (!comment) {
    throw new Error("Comment field is required.");
  }

  const newComment = await prisma.comment.create({
    data: {
      content: comment,
      postId,
      authorId: authorId || "",
    },
    include: {
      author: { select: { username: true } },
    },
  });

  return { message: "Comment created successfully", comment: newComment };
};

export const getCommentsByPostId = async (postId: string) => {
  try {
    validateUUID(postId);

    const postWithComments = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          select: {
            content: true,
            createdAt: true,
            author: { select: { username: true } },
          },
        },
        author: { select: { username: true } },
      },
    });

    if (
      !postWithComments ||
      !postWithComments.comments ||
      postWithComments.comments.length === 0
    ) {
      throw new Error("No comments found for this post.");
    }

    return {
      post: {
        title: postWithComments.title,
        content: postWithComments.content,
        createdAt: postWithComments.createdAt,
        authorUsername: postWithComments.author.username,
        postId: postWithComments.id,
      },
      comments: postWithComments.comments.map((comment) => ({
        content: comment.content,
        createdAt: comment.createdAt,
        authorUsername: comment.author.username,
      })),
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error fetching comments."
    );
  }
};
