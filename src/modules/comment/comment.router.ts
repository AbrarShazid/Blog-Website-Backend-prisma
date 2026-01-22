import { Router } from "express";

import { commentController } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthor);

router.get("/:commentId", commentController.getCommentById);

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.delete(
  "/:commentId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment,
);

router.patch(
  "/:commentId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment,
);

router.patch(
  "/:commentId/statuschange",
  authMiddleware(UserRole.ADMIN),
  commentController.updateCommentStatus,
);

export const commentRouter: Router = router;
