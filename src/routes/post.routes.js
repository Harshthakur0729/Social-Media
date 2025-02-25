import { Router } from "express";
import { createPost, likePost, removeLikePost } from "../controller/post.controller.js";
import { handleFileUpload } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/user.middleware.js";

const router = Router();

router.post("/create", handleFileUpload, authUser, createPost);
router.patch("/like/:postId", authUser, likePost);
router.patch("/unlike/:postId", authUser, removeLikePost);

export default router;
