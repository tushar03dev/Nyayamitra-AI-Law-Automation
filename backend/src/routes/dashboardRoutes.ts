import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
    getDashboardStats,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getNotifications,
    markNotificationRead,
    deleteNotification
} from "../controllers/dashboardController";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Events (calendar)
router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Notifications
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);
router.delete("/notifications/:id", deleteNotification);

export default router;