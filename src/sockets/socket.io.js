import { Server } from "socket.io";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import messageModel from "../models/message.model.js";


function initSocket(server) {
    console.log("Socket is initializing...");
    const io = new Server(server)
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers.token;
            if (!token) {
                return next(new Error("Token is required"));
            }
            const decodedToken = UserModel.verifyToken(token);
            const user = await UserModel.findById(decodedToken._id);
            if (!user) {
                return next(new Error("User not found "))
            }
            socket.user = user;
            next();
        } catch (error) {
            return next(new Error("Invalid token"));
        }
    })





    io.on("connection", (socket) => {
        socket.join(socket.user._id.toString())



        socket.on("chat-message", async (data) => {

            try {
                const { receiver, text } = data;
                console.log(data);
                if (!text || !receiver || !text.trim() || !receiver.trim()) {
                    return
                }

                const sender = socket.user;

                const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);
                if (!isValidReceiver) {
                    return
                }
                const counterPart = await UserModel.findById(receiver);
                if (!counterPart) {
                    return
                }
                await messageModel.create({
                    sender: sender._id,
                    receiver: counterPart._id,
                    text
                })
                io.to(receiver).emit("chat-message", {
                    sender,
                    receiver: counterPart,
                    text,
                })

            } catch (error) {
                console.log(error);

            }



        });


        socket.on("disconnect", () => {
            console.log("User Diconnected");
            socket.leave(socket.user._id.toString());
        })
        console.log("User connected");
    })


}


export default initSocket;
