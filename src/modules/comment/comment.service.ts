import { CommnentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    const parentCommentData = await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          //only id,views and title of post want to show
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return result;
};

const getCommentByAuthor = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

const deleteComment = async (commentId: string, userId: string) => {
  // a user must be loged in to delete comment
  // and comment should be his own
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Your provided input is invalid");
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });

  return result;
};

const updateComment = async (
  commentId: string,
  updatedData: {
    content?: string;
    status?: CommnentStatus;
  },
  authorId: string,
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...updatedData,
    },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
};
