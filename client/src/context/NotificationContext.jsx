import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
