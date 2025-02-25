import { Router } from "express";
import { commentOnPost, createPost, getAllPosts, getPost, likePost, removeLikePost,  } from "../controller/post.controller.js";
import { handleFileUpload, validateComment } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/user.middleware.js";

const router = Router();

router.post("/create", handleFileUpload, authUser, createPost);
router.patch("/like/:postId", authUser, likePost);
router.patch("/unlike/:postId", authUser, removeLikePost);
router.get("/get-all-posts", authUser, getAllPosts);
router.get("/get/:postId", authUser, getPost)
router.post("/comment", authUser, validateComment, commentOnPost)
export default router;
