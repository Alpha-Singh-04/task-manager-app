import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, onCancel, initialData = null, users = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
      // isRecurring: false,
      // recurrenceType: null
  });

  //Log users data
  useEffect(() => {
    console.log('Users:', users);
  }, [users]);

  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      // Format the date properly for the date input (YYYY-MM-DD)
      const formattedData = { ...initialData };
      if (initialData.dueDate) {
        const date = new Date(initialData.dueDate);
        formattedData.dueDate = date.toISOString().split('T')[0];
      }
      setFormData(formattedData);
    } else {
      // Reset form when no initial data
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        assignedTo: '',
        // isRecurring: false,
        // recurrenceType: null
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate due date
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('Due date cannot be in the past');
      return;
    }
    
    onSubmit(formData);
  };

  const handleReset = () => {
    if (onCancel) onCancel();
  };

  // Get priority color based on value
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Get status color based on value
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'in-progress': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'pending': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'overdue': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {initialData?._id ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter task title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter task description"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select 
              id="assignedTo"
              name="assignedTo" 
              value={formData.assignedTo} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a team member</option>
              {Array.isArray(users) && users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))};
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="relative">
              <select 
                id="priority"
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`absolute top-3 right-10 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(formData.priority)}`}>
                {formData.priority}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select 
                id="status"
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`absolute top-3 right-10 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(formData.status)}`}>
                {formData.status}
              </div>
            </div>
          </div>
        </div>

        {/*Code for recurring task*/}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Recurring Task</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence Type
              </label>
              <select
                id="recurrenceType"
                name="recurrenceType"
                value={formData.recurrenceType || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select recurrence type</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
        */}
        {/*End of code for recurring task*/}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData?._id ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}