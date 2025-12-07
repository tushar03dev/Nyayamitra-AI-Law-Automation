import { Request, Response, NextFunction } from 'express';
import { Case } from '../models/caseModel';
import { Message } from '../models/messageModel';
import { User } from '../models/userModel';
import { createCasePayload, updateCasePayload, caseIdParam, userIdParam } from '../types/case';
import { createMessagePayload } from '../types/message';
import { AuthRequest } from '../middleware/auth';
import { flattenZodError } from '../utils/validation';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });

// -------------------------------------------------------------
// GET /cases - Get all cases for user's organization
// -------------------------------------------------------------
export const getCases = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET CASES REQUEST RECEIVED");
    console.log("User:", req.user?.email);

    try {
        const cases = await Case.find({ organizationId: req.user.organizationId })
            .populate('assignedLawyers', 'firstName lastName')
            .populate('assignedJuniors', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(cases);
    } catch (err) {
        console.log("GET CASES ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GET /cases/:id - Get case by ID
// -------------------------------------------------------------
export const getCaseById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET CASE BY ID REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);

    const parsedParams = caseIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const caseData = await Case.findById(req.params.id)
            .populate('assignedLawyers', 'firstName lastName email')
            .populate('assignedJuniors', 'firstName lastName email')
            .populate('organizationId', 'name');

        if (!caseData) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        // Check if user belongs to the same organization
        if (caseData.organizationId.toString() !== req.user.organizationId.toString()) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        res.json(caseData);
    } catch (err) {
        console.log("GET CASE BY ID ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// POST /cases - Create new case
// -------------------------------------------------------------
export const createCase = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("CREATE CASE REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = createCasePayload.safeParse(req.body);
    if (!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        const newCase = new Case({
            ...req.body,
            organizationId: req.user.organizationId
        });

        await newCase.save();
        res.status(201).json(newCase);
    } catch (err) {
        console.log("CREATE CASE ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// PUT /cases/:id - Update case
// -------------------------------------------------------------
export const updateCase = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("UPDATE CASE REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);
    console.log("Payload:", req.body);

    const parsedParams = caseIdParam.safeParse(req.params);
    const parsedPayload = updateCasePayload.safeParse(req.body);

    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    if (!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        const updatedCase = await Case.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('assignedLawyers', 'firstName lastName')
         .populate('assignedJuniors', 'firstName lastName');

        if (!updatedCase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        res.json(updatedCase);
    } catch (err) {
        console.log("UPDATE CASE ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// DELETE /cases/:id - Delete case
// -------------------------------------------------------------
export const deleteCase = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("DELETE CASE REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);

    const parsedParams = caseIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);

        if (!deletedCase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        res.json({ message: 'Case deleted successfully' });
    } catch (err) {
        console.log("DELETE CASE ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GET /cases/:id/participants - Get case participants
// -------------------------------------------------------------
export const getCaseParticipants = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET CASE PARTICIPANTS REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);

    const parsedParams = caseIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const caseData = await Case.findById(req.params.id)
            .populate('assignedLawyers', 'firstName lastName email role')
            .populate('assignedJuniors', 'firstName lastName email role');

        if (!caseData) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        const participants = [
            ...caseData.assignedLawyers,
            ...caseData.assignedJuniors
        ];

        res.json(participants);
    } catch (err) {
        console.log("GET CASE PARTICIPANTS ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// POST /cases/:id/participants - Add participant to case
// -------------------------------------------------------------
export const addCaseParticipant = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("ADD CASE PARTICIPANT REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);
    console.log("Payload:", req.body);

    const parsedParams = caseIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const caseData = await Case.findById(req.params.id);
        if (!caseData) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        const { userId, role } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (role === 'lawyer') {
            if (!caseData.assignedLawyers.includes(userId)) {
                caseData.assignedLawyers.push(userId);
            }
        } else if (role === 'junior_lawyer') {
            if (!caseData.assignedJuniors.includes(userId)) {
                caseData.assignedJuniors.push(userId);
            }
        }

        await caseData.save();
        res.json({ message: 'Participant added successfully' });
    } catch (err) {
        console.log("ADD CASE PARTICIPANT ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// DELETE /cases/:id/participants/:userId - Remove participant from case
// -------------------------------------------------------------
export const removeCaseParticipant = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("REMOVE CASE PARTICIPANT REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);
    console.log("User ID:", req.params.userId);

    const parsedParams = caseIdParam.safeParse(req.params);
    const parsedUserParams = userIdParam.safeParse({ userId: req.params.userId });

    if (!parsedParams.success || !parsedUserParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const caseData = await Case.findById(req.params.id);
        if (!caseData) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        caseData.assignedLawyers = caseData.assignedLawyers.filter(id => id.toString() !== req.params.userId);
        caseData.assignedJuniors = caseData.assignedJuniors.filter(id => id.toString() !== req.params.userId);

        await caseData.save();
        res.json({ message: 'Participant removed successfully' });
    } catch (err) {
        console.log("REMOVE CASE PARTICIPANT ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GET /cases/:id/messages - Get case messages
// -------------------------------------------------------------
export const getCaseMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET CASE MESSAGES REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);

    const parsedParams = caseIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const messages = await Message.find({ caseId: req.params.id })
            .populate('senderId', 'firstName lastName email')
            .sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.log("GET CASE MESSAGES ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// POST /cases/:id/messages - Send message in case
// -------------------------------------------------------------
export const sendCaseMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("SEND CASE MESSAGE REQUEST RECEIVED");
    console.log("Case ID:", req.params.id);
    console.log("Payload:", req.body);

    const parsedParams = caseIdParam.safeParse(req.params);
    const parsedPayload = createMessagePayload.safeParse(req.body);

    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    if (!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        const newMessage = new Message({
            ...req.body,
            senderId: req.user._id
        });

        await newMessage.save();
        await newMessage.populate('senderId', 'firstName lastName email');

        res.status(201).json(newMessage);
    } catch (err) {
        console.log("SEND CASE MESSAGE ERROR:", err);
        next(err);
    }
};

// Placeholder for document endpoints - need file handling
export const getCaseDocuments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // TODO: Implement document retrieval
    res.json({ message: 'Documents endpoint not implemented yet' });
};

export const uploadCaseDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // TODO: Implement document upload
    res.json({ message: 'Document upload endpoint not implemented yet' });
};

export const deleteCaseDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // TODO: Implement document deletion
    res.json({ message: 'Document deletion endpoint not implemented yet' });
};