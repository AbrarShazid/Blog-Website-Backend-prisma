import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment Creation Failed!",
      details: error,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment fetched Failed!",
      details: error,
    });
  }
};
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment fetched Failed!",
      details: error,
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment delete Failed!",
      details: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commendId } = req.params;
    const user = req.user;
    const result = await commentService.updateComment(
      commendId as string,
      req.body,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment update Failed!",
      details: error,
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
};
