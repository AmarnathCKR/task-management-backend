const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    taskData : String,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
