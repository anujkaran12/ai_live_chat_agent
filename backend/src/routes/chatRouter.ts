import { Router } from "express";
import { getHistory, sendMessage } from "../controllers/chatController";

const router = Router();

router.post("/message", sendMessage);
router.get("/history/:sessionId", getHistory);

export default router;
