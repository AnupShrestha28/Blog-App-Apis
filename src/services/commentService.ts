import { PrismaClient } from "@prisma/client";
import { validateUUID } from "../utils/validationUtils";

const prisma = new PrismaClient();

const createResponse = (
  success: boolean,
  message: string,
  data: any = null,
  statusCode: number = 200
) => ({
  success,
  message,
  data,
  statusCode,
});

export const createComment = async (
  comment: string,
  postId: string,
  authorId?: string
) => {
  try {
    validateUUID(postId);

    if (!comment) {
      return createResponse(false, "Comment field is required.", null, 400);
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

    return createResponse(
      true,
      "Comment created successfully.",
      newComment,
      201
    );
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error
        ? error.message
        : "An error occurred while creating the comment.",
      null,
      500
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

    if (!postWithComments) {
      return createResponse(false, "Post not found.", null, 404);
    }

    return createResponse(
      true,
      "Comments fetched successfully.",
      {
        post: {
          title: postWithComments.title,
          content: postWithComments.content,
          createdAt: postWithComments.createdAt,
          authorUsername: postWithComments.author.username,
          postId: postWithComments.id,
        },
        comments: postWithComments.comments.map((comment) => ({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          authorUsername: comment.author.username,
        })),
      },
      200
    );
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error
        ? error.message
        : "An error occurred while fetching comments.",
      null,
      500
    );
  }
};

export const updateComment = async (
  id: string,
  content: string,
  userId: string
) => {
  try {
    validateUUID(id);

    if (!content) {
      return createResponse(false, "Comment content is required.", null, 400);
    }

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment || comment.authorId !== userId) {
      return createResponse(
        false,
        "Comment not found or you are not authorized to edit this comment.",
        null,
        403
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return createResponse(
      true,
      "Comment updated successfully.",
      updatedComment,
      200
    );
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error
        ? error.message
        : "An error occurred while updating the comment.",
      null,
      500
    );
  }
};

export const deleteComment = async (id: string, userId: string) => {
  try {
    validateUUID(id);

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment || comment.authorId !== userId) {
      return createResponse(
        false,
        "Comment not found or you are not authorized to delete this comment.",
        null,
        403
      );
    }

    await prisma.comment.delete({ where: { id } });

    return createResponse(true, "Comment deleted successfully.", null, 200);
  } catch (error) {
    return createResponse(
      false,
      error instanceof Error
        ? error.message
        : "An error occurred while deleting the comment.",
      null,
      500
    );
  }
};
