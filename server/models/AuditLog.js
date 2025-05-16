const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetModel: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
