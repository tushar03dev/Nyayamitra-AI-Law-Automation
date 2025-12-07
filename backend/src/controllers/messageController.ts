import { Request, Response, NextFunction } from "express";
import { Message } from "../models/messageModel";
import { Case } from "../models/caseModel";
import { createMessagePayload } from "../types/message";
import { AuthRequest } from "../middleware/auth";
import { flattenZodError } from "../utils/validation";

// -------------------------------------------------------------
// GET /messages?caseId=... - Get messages for a case
// -------------------------------------------------------------
export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("GET MESSAGES REQUEST RECEIVED");
  console.log("Query:", req.query);

  const { caseId } = req.query;
  if (!caseId || typeof caseId !== "string") {
    res.status(400).json({ message: "caseId is required" });
    return;
  }

  try {
    // Check if case exists and user has access
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    if (caseData.organizationId.toString() !== req.user.organizationId.toString()) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const messages = await Message.find({ caseId })
      .populate("senderId", "firstName lastName email")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.log("GET MESSAGES ERROR:", err);
    next(err);
  }
};

// -------------------------------------------------------------
// POST /messages - Send a message
// -------------------------------------------------------------
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("SEND MESSAGE REQUEST RECEIVED");
  console.log("Payload:", req.body);

  const parsedPayload = createMessagePayload.safeParse(req.body);
  if (!parsedPayload.success) {
    console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
    res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
    return;
  }

  try {
    // Check if case exists and user has access
    const caseData = await Case.findById(req.body.caseId);
    if (!caseData) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    if (caseData.organizationId.toString() !== req.user.organizationId.toString()) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const newMessage = new Message({
      ...req.body,
      senderId: req.user._id,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "firstName lastName email");

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err);
    next(err);
  }
};