import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (
  content: string,
  postId: string,
  authorId: string
) => {
  if (!content || !postId || !authorId) {
    throw new Error("Content, postId, and authorId are required.");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
    include: {
      author: { select: { username: true } },
    },
  });

  return comment;
};

export const getCommentsByPostId = async (postId: string) => {
    try {
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
  
      if (!postWithComments) {
        throw new Error('Post not found.');
      }
  
      return {
        post: {
          title: postWithComments.title,
          content: postWithComments.content,
          createdAt: postWithComments.createdAt,
          authorUsername: postWithComments.author.username, 
          postId: postWithComments.id, 
        },
        comments: postWithComments.comments,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error fetching comments.');
    }
  };
  
  
  
