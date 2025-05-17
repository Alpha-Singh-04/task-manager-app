const Task = require("../models/Task");
const Notification = require("../models/Notification");

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

    // Send notification to assigned user (if not the same as creator)
    if (assignedTo && assignedTo !== req.user.id.toString()) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned a new task: "${title}".`,
        task: task._id
      });
    }

    _io.emit('taskAssigned', {
      taskId: task._id,
      assignedTo: task.assignedTo,
      message: `A new task "${task.title}" was assigned to you.`,
    });

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

    if (status) query.status = status.toLowerCase();
    if (priority) query.priority = priority.toLowerCase();
    if (dueDate) {
      const startDate = new Date(dueDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dueDate);
      endDate.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startDate, $lte: endDate };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name')
      .sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Task Fetch Error:', err);
    res.status(500).json({ 
      message: "Error fetching tasks", 
      error: err.message 
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldAssignedTo = task.assignedTo?.toString();

    Object.assign(task, req.body);
    const updatedTask = await task.save();

    // If task assignment changed
    if (req.body.assignedTo && req.body.assignedTo !== oldAssignedTo) {
      await Notification.create({
        user: req.body.assignedTo,
        message: `You have been reassigned a task: "${task.title}".`,
      });
    }

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