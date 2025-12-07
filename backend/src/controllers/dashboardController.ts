import { Request, Response, NextFunction } from 'express';
import { Case } from '../models/caseModel';
import { Hearing } from '../models/hearingModel';
import { Event } from '../models/eventModel';
import { Notification } from '../models/notificationModel';
import { User } from '../models/userModel';
import { createEventPayload, updateEventPayload, eventIdParam, dateQueryParam } from '../types/dashboard';
import { AuthRequest } from '../middleware/auth';
import { flattenZodError } from '../utils/validation';

// -------------------------------------------------------------
// GET /dashboard/stats - Get dashboard statistics
// -------------------------------------------------------------
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET DASHBOARD STATS REQUEST RECEIVED");
    console.log("User:", req.user?.email);

    try {
        const organizationId = req.user.organizationId;

        // Get all cases for the organization
        const allCases = await Case.find({ organizationId });

        const totalCases = allCases.length;
        const activeCases = allCases.filter(c => c.status === 'ongoing').length;

        // Get upcoming hearings (next 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const upcomingHearings = allCases.filter(c =>
            c.nextHearingDate &&
            new Date(c.nextHearingDate) <= sevenDaysFromNow &&
            new Date(c.nextHearingDate) >= new Date()
        ).length;

        // Get team members count (users in organization)
        const teamMembers = await User.countDocuments({ organizationId });

        // Cases by status
        const casesByStatus = [
            { status: 'open', count: allCases.filter(c => c.status === 'open').length },
            { status: 'ongoing', count: allCases.filter(c => c.status === 'ongoing').length },
            { status: 'on_hold', count: allCases.filter(c => c.status === 'on_hold').length },
            { status: 'closed', count: allCases.filter(c => c.status === 'closed').length }
        ];

        // Cases by priority
        const casesByPriority = [
            { priority: 'low', count: allCases.filter(c => c.priority === 'low').length },
            { priority: 'medium', count: allCases.filter(c => c.priority === 'medium').length },
            { priority: 'high', count: allCases.filter(c => c.priority === 'high').length }
        ];

        // Case workload (lawyers and their case counts)
        const lawyers = await User.find({ organizationId, role: 'lawyer' });
        const caseWorkload = lawyers.map(lawyer => {
            const lawyerCases = allCases.filter(c =>
                c.assignedLawyers.some(id => id.toString() === lawyer._id.toString())
            );
            return {
                lawyer: lawyer.name,
                cases: lawyerCases.length
            };
        });

        // Hearing timeline (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const hearingTimeline = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const count = allCases.filter(c =>
                c.nextHearingDate &&
                new Date(c.nextHearingDate).toDateString() === date.toDateString()
            ).length;
            hearingTimeline.push({
                date: date.toISOString().split('T')[0],
                count
            });
        }

        const stats = {
            totalCases,
            activeCases,
            upcomingHearings,
            teamMembers,
            casesByStatus,
            casesByPriority,
            caseWorkload,
            hearingTimeline
        };

        res.json(stats);
    } catch (err) {
        console.log("GET DASHBOARD STATS ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GET /dashboard/events?date=YYYY-MM-DD - Get events for a date
// -------------------------------------------------------------
export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET EVENTS REQUEST RECEIVED");
    console.log("Date:", req.query.date);

    const parsedQuery = dateQueryParam.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json({ errors: flattenZodError(parsedQuery.error) });
        return;
    }

    try {
        const startDate = new Date(req.query.date as string);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const events = await Event.find({
            userId: req.user._id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).sort({ date: 1 });

        res.json(events);
    } catch (err) {
        console.log("GET EVENTS ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// POST /dashboard/events - Create new event
// -------------------------------------------------------------
export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("CREATE EVENT REQUEST RECEIVED");
    console.log("Payload:", req.body);

    const parsedPayload = createEventPayload.safeParse(req.body);
    if (!parsedPayload.success) {
        console.log("ZOD VALIDATION FAILED:", flattenZodError(parsedPayload.error));
        res.status(400).json({ errors: flattenZodError(parsedPayload.error) });
        return;
    }

    try {
        const newEvent = new Event({
            ...req.body,
            userId: req.user._id,
            date: new Date(req.body.date)
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.log("CREATE EVENT ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// PUT /dashboard/events/:id - Update event
// -------------------------------------------------------------
export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("UPDATE EVENT REQUEST RECEIVED");
    console.log("Event ID:", req.params.id);
    console.log("Payload:", req.body);

    const parsedParams = eventIdParam.safeParse(req.params);
    const parsedPayload = updateEventPayload.safeParse(req.body);

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
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body, date: req.body.date ? new Date(req.body.date) : undefined },
            { new: true }
        );

        if (!updatedEvent) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.json(updatedEvent);
    } catch (err) {
        console.log("UPDATE EVENT ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// DELETE /dashboard/events/:id - Delete event
// -------------------------------------------------------------
export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("DELETE EVENT REQUEST RECEIVED");
    console.log("Event ID:", req.params.id);

    const parsedParams = eventIdParam.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ errors: flattenZodError(parsedParams.error) });
        return;
    }

    try {
        const deletedEvent = await Event.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!deletedEvent) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.log("DELETE EVENT ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// GET /dashboard/notifications - Get user notifications
// -------------------------------------------------------------
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("GET NOTIFICATIONS REQUEST RECEIVED");
    console.log("User:", req.user?.email);

    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(notifications);
    } catch (err) {
        console.log("GET NOTIFICATIONS ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// PUT /dashboard/notifications/:id/read - Mark notification as read
// -------------------------------------------------------------
export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("MARK NOTIFICATION READ REQUEST RECEIVED");
    console.log("Notification ID:", req.params.id);

    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.json(notification);
    } catch (err) {
        console.log("MARK NOTIFICATION READ ERROR:", err);
        next(err);
    }
};

// -------------------------------------------------------------
// DELETE /dashboard/notifications/:id - Delete notification
// -------------------------------------------------------------
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("DELETE NOTIFICATION REQUEST RECEIVED");
    console.log("Notification ID:", req.params.id);

    try {
        const deletedNotification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!deletedNotification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.log("DELETE NOTIFICATION ERROR:", err);
        next(err);
    }
};