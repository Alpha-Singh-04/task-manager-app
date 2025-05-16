const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ 
      message: "Error creating task", 
      error: err.message 
    });
  }
};

// Get Tasks (createdBy or assignedTo)
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).sort({ dueDate: 1 });

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