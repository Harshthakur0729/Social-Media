import mongoose from "mongoose";
import config from "../config/config.js";

const connect = () => {
    mongoose.connect(config.MONGODB_URL).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("Error connecting to MongoDB", error);
    })
}

export default connect;
