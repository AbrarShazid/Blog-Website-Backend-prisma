import { Router } from "express";
import { PostController } from "./post.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", PostController.getAllPost);

router.get("/:postId", PostController.getPostById);

router.post("/", authMiddleware(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
