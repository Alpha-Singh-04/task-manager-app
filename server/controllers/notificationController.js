const Notification = require("../models/Notification");

// Get user's notifications
const getNotifications = async (req, res) => {
  console.log('getNotifications - User:', req.user);
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('task', 'title')
      .sort({ createdAt: -1 });

    console.log('Found notifications:', notifications);
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Notification Fetch Error:', err);
    res.status(500).json({
      message: "Error fetching notifications",
      error: err.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  console.log('markAsRead - Notification ID:', req.params.id);
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      console.log('Notification not found:', req.params.id);
      return res.status(404).json({ message: "Notification not found" });
    }

    console.log('Marked notification as read:', notification);
    res.status(200).json(notification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({
      message: "Error updating notification",
      error: err.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  console.log('markAllAsRead - User:', req.user.id);
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    console.log('Marked all notifications as read:', result);
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({
      message: "Error updating notifications",
      error: err.message
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};