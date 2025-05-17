import { useNotifications } from '@/context/NotificationContext';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const NotificationBell = () => {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-2">
          <h4 className="text-sm font-semibold px-2 py-1">Notifications</h4>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="text-gray-500 text-sm px-2 py-2">No notifications</li>
            )}
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-2 text-sm border-b cursor-pointer ${
                  n.isRead ? 'text-gray-500' : 'font-semibold text-black'
                }`}
                onClick={() => markAsRead(n._id)}
              >
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Header = ({ onAddTask, isFormVisible }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
        {user && <p className="text-gray-600">Welcome, {user.name}</p>}
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <button 
          onClick={onAddTask} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          {isFormVisible ? 'Hide Form' : 'Add New Task'}
        </button>
        <button 
          onClick={logout} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
