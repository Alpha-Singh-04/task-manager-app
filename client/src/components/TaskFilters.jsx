import { useState } from 'react';

export default function TaskFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    title: '',
    status: '',
    priority: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = { title: '', status: '', priority: '', dueDate: '' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Filter Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Search by title"
          value={filters.title}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={filters.dueDate}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
