import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

export const createComment = async (
  comment: string,
  postId: string,
  authorId?: string
) => {
  try {
    validateUUID(postId);

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
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred."
    );
  }
};

export const getCommentsByPostId = async (postId: string) => {
  try {
    validateUUID(postId);

    const postWithComments = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          select: {
            id: true,
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
        commentId: comment.id, // Include the comment ID in the response
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

export const updateComment = async (
  id: string,
  content: string,
  userId: string
) => {
  try {
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    if (!content) {
      throw new Error("Comment content is required.");
    }

    validateUUID(id);

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment || comment.authorId !== userId) {
      throw new Error(
        "Comment not found or you are not authorized to edit this comment."
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return updatedComment;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating comment."
    );
  }
};

export const deleteComment = async (id: string, userId: string) => {
  try {
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    validateUUID(id);

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment || comment.authorId !== userId) {
      throw new Error(
        "Comment not found or you are not authorized to delete this comment."
      );
    }

    await prisma.comment.delete({
      where: { id },
    });

    return { message: "Comment deleted successfully." };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting comment."
    );
  }
};
