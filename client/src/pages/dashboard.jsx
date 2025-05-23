'use client';
import { useEffect, useState } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TaskFilters from '@/components/TaskFilters';
import Header from '@/common/Header';
import socket from '@/utils/socket';

export default function DashboardPage() {
  const { user, token, logout, loading:authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filters, setFilters] = useState({});

  // Fetch all users (for assignment dropdown)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/api/auth/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(Array.isArray(data) ? data : []);  // Ensure we're setting an array
      console.log('Fetched users:', data);  // Debug log
    } catch (err) {
      console.error('User Fetch Error:', err.message);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tasks created by or assigned to this user
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTasks(data);
        setError('');
      } else {
        throw new Error('Expected JSON response, but got something else.');
      }
    } catch (err) {
      console.error('Task Fetch Error:', err.message);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };



  // Create or update task
  const handleTaskSubmit = async formData => {
    try {
      // Format the data before sending
      const formattedData = {
        ...formData,
        priority: formData.priority.toLowerCase(),
        status: formData.status.toLowerCase(),
        dueDate: new Date(formData.dueDate).toISOString()
      };

      const method = selectedTask?._id ? 'PUT' : 'POST';
      const url = selectedTask?._id
        ? `http://localhost:5000/api/tasks/${selectedTask._id}`
        : 'http://localhost:5000/api/tasks';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save task');

      setSelectedTask(null);
      setIsFormVisible(false);
      fetchTasks(); // refresh task list
    } catch (err) {
      console.error('Task Submit Error:', err.message);
      setError(err.message || 'Failed to save task');
    }
  };

  const handleDelete = async taskId => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchTasks(); // refresh
    } catch (err) {
      console.error('Delete Error:', err.message);
      setError('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsFormVisible(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancel = () => {
    setSelectedTask(null);
    setIsFormVisible(false);
  };

  const fetchFilteredTasks = async (filters) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/api/tasks?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setTasks(data); // The API returns the tasks array directly
      setError('');
    } catch (err) {
      console.error('Failed to fetch filtered tasks:', err);
      setError('Failed to fetch filtered tasks');
    }
  };


  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredTasks(newFilters);
  };

  useEffect(() => {
    // wait for auth to finish loading
    if (authLoading) return;

    // if no token after auth has loaded, redirect to login
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchTasks();
    fetchUsers();
  }, [token, router, authLoading]);

  useEffect(() => {
    socket.on('taskAssigned', (data) => {
      if (data.assignedTo === currentUserId) {
        alert(data.message); // Or show toast, badge, etc.
      }
    });

    return () => {
      socket.off('taskAssigned');
    };
  }, []);

  if(authLoading){
    return(
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <Header 
        onAddTask={() => setIsFormVisible(!isFormVisible)}
        isFormVisible={isFormVisible}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <div id="task-form" className={`transition-all duration-300 ${isFormVisible ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <TaskForm 
          onSubmit={handleTaskSubmit} 
          onCancel={handleCancel}
          initialData={selectedTask} 
          users={users} 
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
          <div className="text-sm text-gray-600">
            {tasks?.length || 0} {tasks?.length === 1 ? 'task' : 'tasks'} found
          </div>
        </div>

        <div id="task-form" className={`transition-all duration-300 $ max-h-[800px] opacity-100 `}>
          <TaskFilters onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {tasks?.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No tasks found. Create your first task!
              </div>
            )}
            <div className="grid gap-4">
              {tasks?.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDelete(task._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}