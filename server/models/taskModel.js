const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Task must belong to user"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Task title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Task description is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Done"],
        message: "{VALUE} is not a valid status",
      },
      default: "To Do",
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not a valid priority",
      },
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
