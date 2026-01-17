import {
  CommnentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];
  if (payload.search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: payload.tags as string[],
      },
    });
  }

  if (typeof payload.isFeatured === "boolean") {
    andCondition.push({
      isFeatured: payload.isFeatured,
    });
  }

  if (payload.status) {
    andCondition.push({
      status: payload.status,
    });
  }

  if (payload.authorId) {
    andCondition.push({
      authorId: payload.authorId,
    });
  }

  const result = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,

    where: {
      AND: andCondition,
    },
    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },

    include:{
      _count:{
        select:{
          comments:true
        }
      }
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });


 

  return {
    data: result,
    pagination: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPages: Math.ceil(total / payload.limit),
    },
  };
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (anyName) => {
    await anyName.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const postData = await anyName.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommnentStatus.APPROVED,
          },

          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommnentStatus.APPROVED,
              },
              orderBy:{createdAt:"asc"},
              include: {
                replies: {
                  where: {
                    status: CommnentStatus.APPROVED,
                  },
                  orderBy:{createdAt:"asc"}
                },
              },
            },
          },
        },

        _count:{
          select:{
            comments:true
          }
        }
      },
    });
    return postData;
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
};
