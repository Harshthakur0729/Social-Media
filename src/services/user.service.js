import userModel from "../models/user.model.js";

export const createUser = async ({ username, email, password }) => {
    if (!username || !email || !password) {
        throw new Error("All fields are required");
    }
    const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isUserAlreadyExist) {
        throw new Error("User already exists");
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({ username, email, password: hashedPassword });
    await user.save();
    delete user._doc.password;
    return user;
};


export const loginUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordCorrect = await userModel.comparePassword.call(user, password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }
    delete user._doc.password;
    return user;
};