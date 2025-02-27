import { Router } from "express";
import { getMessagesController, Userlogin, Userlogout, Userregister } from "../controller/user.controller.js";
import { authUser, loginUserValidation, registerUserValidation } from "../middleware/user.middleware.js";

const router = Router();

router.post("/register", registerUserValidation, Userregister);
router.post("/login", loginUserValidation, Userlogin);
router.get("/profile", authUser, (req, res) => {
    if (!req.user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: req.user });
});
router.get("/logout", authUser, Userlogout)

router.get("/get-messages", authUser, getMessagesController)
export default router;
