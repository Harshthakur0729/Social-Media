import postModel from "../models/post.model.js";
import { generateCaptionFromImageBuffer } from "../services/ai.service.js";
import { uploadFile } from "../services/cloudStorage.service.js";
import likeModel from "../models/likes.model.js";
export const createPost = async (req, res) => {
    try {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            return res.status(400).json({ message: "Image is required" })
        }
        const [caption, fileData] = await Promise.all([
            generateCaptionFromImageBuffer(imageBuffer),
            uploadFile(imageBuffer)
        ])
        const newPost = await postModel.create({
            caption,
            media: fileData,
            author: req.user._id
        })

        res.status(201).json({ post: newPost, message: "Post created successfully" })
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Internal server error" })
    }

}


export const likePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        console.log(postId);

        if (!postModel.isValidPostId(postId)) {
            return res.status(400).json({ message: "Invalid post id" })
        }
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const isAlreadyLiked = await likeModel.findOne({ post: postId, user: req.user._id })
        if (isAlreadyLiked) {
            return res.status(400).json({ message: "You have already liked this post" })
        }
        await likeModel.create({ post: postId, user: req.user._id })
        await post.incrementLikeCount();
        res.status(200).json({ message: "Post liked successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}


export const removeLikePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        if (!postModel.isValidPostId(postId)) {
            return res.status(400).json({ message: "Invalid post id" })
        }
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const userLikedPost = await likeModel.findOne({ post: postId, user: req.user._id })
        if (!userLikedPost) {
            return res.status(200).json({ message: "You have not liked this post" })
        }
        await likeModel.findOneAndDelete({ post: postId, user: req.user._id });
        await post.decrementLikeCount();
        await post.save();

        res.status(200).json({ message: "Post unliked successfully" })

    } catch (error) {
        console.log(error);
    }
}
