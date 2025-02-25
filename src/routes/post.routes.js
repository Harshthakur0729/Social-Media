import { Router } from "express";
import { createPost } from "../controller/post.controller.js";
import { handleFileUpload } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/user.middleware.js";

const router = Router();

router.post("/create", handleFileUpload, authUser, createPost);

export default router;
