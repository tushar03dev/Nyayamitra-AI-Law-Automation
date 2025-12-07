import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /messages?caseId=... - Get messages for a case
router.get("/", getMessages);

// POST /messages - Send a message
router.post("/", sendMessage);

export default router;