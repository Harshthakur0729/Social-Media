import { validationResult } from "express-validator";
import { createUser, loginUser } from "../services/user.service.js";
import redis from "../services/redis.service.js";
import messageModel from "../models/message.model.js";

// Register User
export const Userregister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;
        const user = await createUser({ username, email, password });
        const token = user.generateToken();
        return res.status(201).json({ message: "User created successfully", user: { username: user.username, email: user.email, id: user._id }, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login User
export const Userlogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await loginUser({ email, password });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = user.generateToken();
        return res.status(200).json({ message: "User logged in successfully", user: { username: user.username, email: user.email, id: user._id }, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Logout User

export const Userlogout = async (req, res) => {
    const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now();
    await redis.set(`blacklist:${req.tokenData.token}`, true, "EX", Math.floor(timeRemainingForToken / 1000));
    res.send('logout')
}


export const getMessagesController = async (req, res) => {
    try {
        const messages = await messageModel.find({
            $or: [
                {
                    sender: req.user._id,
                    // receiver: req.query.userId
                },
                {
                    // sender:  req.query.userId,
                    receiver:req.user._id
                }
            ]

        })
        res.status(200).json({
            messages,
            messagesCount: messages.length,
            message: "Messages are successfully fetched"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}