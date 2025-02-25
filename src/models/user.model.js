import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        trim: true,
        lowercase: true,
        minLength: [3, "Username must be at least 3 characters"],
        maxLength: [15, "Username must be at most 20 characters"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters"],
        maxLength: [40, "Email must be at most 50 characters"],
    },

    profileImage: {
        type: String,
        default: "https://media.istockphoto.com/id/1327592449/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=yqoos7g9jmufJhfkbQsk-mdhKEsih6Di4WZ66t_ib7I=",
    },

    password: {
        type: String,
        select: false,
    },
})


// Static method for password hashing
userSchema.statics.hashPassword = async function (password) {
    if (!password) {
        throw new Error("password is required");
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Static method for password comparison
userSchema.statics.comparePassword = async function (password) {
    if (!password) {
        throw new Error("password is required");
    }
    return await bcrypt.compare(password, this.password);
};

// Instance method for JWT token generation
userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id, username: this.username, email: this.email }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    return token;
};

// Static method for JWT token verification
userSchema.statics.verifyToken = function (token) {
    if (!token) {
        throw new Error("token is required");
    }
    return jwt.verify(token, config.JWT_SECRET);
};

const User = mongoose.model("User", userSchema);

export default User;
