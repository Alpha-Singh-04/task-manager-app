import { useState } from 'react';

export default function TaskCard({ task, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format the date properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Determine priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Determine status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'Completed';
  };

  // Calculate days left or overdue
  const getDaysMessage = () => {
    if (!task.dueDate) return '';
    
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return task.status === 'Completed' 
        ? 'Completed on time' 
        : `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    }
  };

  return (
    <div className={`p-5 bg-white shadow rounded-lg border-l-4 transition-all duration-300 
      ${isOverdue() ? 'border-red-500' : task.status === 'Completed' ? 'border-green-500' : 'border-blue-500'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(task.status)}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(task.priority)}`}>
              {task.priority} Priority
            </span>
            {isOverdue() && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                Overdue
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="mr-2">Due: {formatDate(task.dueDate)}</span>
              {task.dueDate && (
                <span className={`text-xs ${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  ({getDaysMessage()})
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Expandable area */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-3' : 'max-h-0'}`}>
        <p className="text-gray-600 text-sm border-t pt-3 mb-3">{task.description}</p>
        
        {task.assignedTo && task.assignedTo.name && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Assigned to: {task.assignedTo.name}</span>
          </div>
        )}
        
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => onEdit(task)} 
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(task._id)} 
            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}