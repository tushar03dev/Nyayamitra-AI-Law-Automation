import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    deleteCase,
    getCaseParticipants,
    addCaseParticipant,
    removeCaseParticipant,
    getCaseMessages,
    sendCaseMessage,
    getCaseDocuments,
    uploadCaseDocument,
    deleteCaseDocument,
    upload
} from "../controllers/caseController";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Case CRUD routes
router.get("/", getCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);

// Case participants routes
router.get("/:id/participants", getCaseParticipants);
router.post("/:id/participants", addCaseParticipant);
router.delete("/:id/participants/:userId", removeCaseParticipant);

// Case messages routes
router.get("/:id/messages", getCaseMessages);
router.post("/:id/messages", sendCaseMessage);

// Case documents routes (placeholders for now)
router.get("/:id/documents", getCaseDocuments);
router.post("/:id/documents/upload", upload.single('document'), uploadCaseDocument);
router.delete("/:id/documents/:docId", deleteCaseDocument);

export default router;