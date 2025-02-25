import { Router } from "express";
import generateContent from "../services/ai.service.js";


const router = Router();

router.get('/', async (req, res) => {
    const prompt = req.query.prompt;
    const caption = await generateContent(prompt)
    res.json({ caption })
})



export default router;
