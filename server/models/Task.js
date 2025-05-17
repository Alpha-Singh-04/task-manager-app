const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed", "overdue"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  /*isRecurring: { type: Boolean, default: false },
  recurrenceType: { type: String, enum: ["daily", "weekly", "monthly"], default: null }*/
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
