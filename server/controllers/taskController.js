const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !assignedTo) {
      return res.status(400).json({
        message: "Missing required fields",
        required: { title: !title, description: !description, dueDate: !dueDate, assignedTo: !assignedTo }
      });
    }

    // Format the data
    const taskData = {
      title,
      description,
      priority: priority?.toLowerCase() || 'medium',
      status: status?.toLowerCase() || 'pending',
      dueDate: new Date(dueDate),
      assignedTo,
      createdBy: req.user.id,
    };

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (err) {
    console.error('Task Creation Error:', err);
    res.status(500).json({ 
      message: "Error creating task", 
      error: err.message 
    });
  }
};

// Get Tasks (createdBy or assignedTo)
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, dueDate } = req.query;
    const query = { 
      $or: [
        { createdBy: req.user.id }, 
        { assignedTo: req.user.id }
      ]
    };

    if (search) {
      query.$and = [{
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = new Date(dueDate); // ISO format

    const tasks = await Task.find(query).populate('assignedTo', 'name').sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching tasks", 
      error: err.message 
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!updatedTask) return res.status(404).json({ 
      message: "Task not found" 
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ 
      message: "Error updating task", error: err.message 
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ 
      message: "Task deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error deleting task", 
      error: err.message 
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
}