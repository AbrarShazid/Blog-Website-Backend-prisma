import { Router } from "express";
import { PostController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", PostController.getAllPost);

router.get(
  "/my-posts",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts,
);

router.get("/:postId", PostController.getPostById);

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.createPost,
);

router.patch(
  "/:postId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  PostController.updatePost,
);

export const postRouter: Router = router;
