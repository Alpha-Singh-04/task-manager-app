const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require("../controllers/notificationController");

// All routes require authentication
router.use(authMiddleware);

// Get user's notifications
router.get("/", getNotifications);

// Mark a notification as read
router.put("/:id/read", markAsRead);

// Mark all notifications as read
router.put("/read-all", markAllAsRead);

module.exports = router;
