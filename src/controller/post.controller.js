import postModel from "../models/post.model.js";
import { generateCaptionFromImageBuffer } from "../services/ai.service.js";
import { uploadFile } from "../services/cloudStorage.service.js";

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