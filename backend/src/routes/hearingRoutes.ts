import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
    getHearings,
    createHearing,
    updateHearing,
    deleteHearing
} from "../controllers/hearingController";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Hearing CRUD routes
router.get("/", getHearings);
router.post("/", createHearing);
router.put("/:id", updateHearing);
router.delete("/:id", deleteHearing);

export default router;