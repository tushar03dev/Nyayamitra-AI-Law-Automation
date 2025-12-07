import { Request, Response, NextFunction } from 'express';
import { Hearing } from '../models/hearingModel';
import { Case } from '../models/caseModel';
import { createHearingPayload, updateHearingPayload, hearingIdParam } from '../types/hearing';
import { AuthRequest } from '../middleware/auth';
import { flattenZodError } from '../utils/validation';

// -------------------------------------------------------------
// GET /hearings - Get all hearings for user's organization
// -------------------------------------------------------------
export const getHearings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET HEARINGS REQUEST RECEIVED");
    console.log("User:", req.user?.email);

    try {
        const cases = await Case.find({ organizationId: req.user.organizationId }).select('_id');
        const caseIds = cases.map(c => c._id);

        const hearings = await Hearing.find({ caseId: { $in: caseIds } })
            .populate({
                path: 'caseId',
                select: 'title caseNumber clientNames',
                populate: {
                    path: 'assignedLawyers assignedJuniors',
                    select: 'name'
                }
            })
            .sort({ date: 1, time: 1 });

        // Add caseTitle to each hearing
        const hearingsWithCaseTitle = hearings.map(hearing => ({
            ...hearing.toObject(),
            caseTitle: (hearing as any).caseId?.title || 'Unknown Case'
        }));

        res.json(hearingsWithCaseTitle);
    } catch (err) {
        console.log("GET HEARINGS ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// POST /hearings - Create new hearing
// -------------------------------------------------------------
export const createHearing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("CREATE HEARING REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = createHearingPayload.safeParse(req.body);
    if (!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        // Verify case belongs to user's organization
        const caseData = await Case.findById(req.body.caseId);
        if (!caseData) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        if (caseData.organizationId.toString() !== req.user.organizationId.toString()) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        const newHearing = new Hearing(req.body);
        await newHearing.save();

        // Update case nextHearingDate if this is upcoming
        const hearingDate = new Date(req.body.date + 'T' + req.body.time);
        if (hearingDate > new Date()) {
            await Case.findByIdAndUpdate(req.body.caseId, { nextHearingDate: hearingDate });
        }

        res.status(201).json(newHearing);
    } catch (err) {
        console.log("CREATE HEARING ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// PUT /hearings/:id - Update hearing
// -------------------------------------------------------------
export const updateHearing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("UPDATE HEARING REQUEST RECEIVED");
    console.log("Hearing ID:", req.params.id);
    console.log("Payload:", req.body);

    const parsedParams = hearingIdParam.safeParse(req.params);
    const parsedPayload = updateHearingPayload.safeParse(req.body);

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
        const updatedHearing = await Hearing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('caseId', 'title caseNumber');

        if (!updatedHearing) {
            res.status(404).json({ message: 'Hearing not found' });
            return;
        }

        res.json(updatedHearing);
    } catch (err) {
        console.log("UPDATE HEARING ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// DELETE /hearings/:id - Delete hearing
// -------------------------------------------------------------
export const deleteHearing = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("DELETE HEARING REQUEST RECEIVED");
    console.log("Hearing ID:", req.params.id);

    const parsedParams = hearingIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const deletedHearing = await Hearing.findByIdAndDelete(req.params.id);

        if (!deletedHearing) {
            res.status(404).json({ message: 'Hearing not found' });
            return;
        }

        res.json({ message: 'Hearing deleted successfully' });
    } catch (err) {
        console.log("DELETE HEARING ERROR:", err);
        next(err);
    }
};