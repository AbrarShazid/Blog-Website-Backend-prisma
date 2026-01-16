import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized ",
      });
    }

    const result = await postService.createPost(req.body, user.id);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    let searchString;
    if (typeof search === "string") {
      searchString = search;
    } else {
      searchString = undefined;
    }

    // filtering by tags
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    //filter by isFeatured
    let isFeatured = undefined;

    if (req.query.isFeatured === "true") {
      isFeatured = true;
    } else if (req.query.isFeatured === "false") {
      isFeatured = false;
    }

    // filter by status of post

    const status = req.query.status as PostStatus | undefined;

    // filter by authorID

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "Data can't be fetched!",
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throw new Error("Post id is required");
      // it basically added to resolve the ts error in this case
    }

    const result = await postService.getPostById(postId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Data can't be fetched!",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
};
