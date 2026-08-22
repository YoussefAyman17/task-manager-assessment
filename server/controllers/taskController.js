const Task = require("../models/taskModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

exports.createTask = asyncHandler(async (req, res, next) => {
  const taskData = { ...req.body, user: req.user.id };
  const task = await Task.create(taskData);
  res.status(201).json({
    status: "success",
    data: task,
  });
});

exports.getTasks = asyncHandler(async (req, res, next) => {
  const { status, priority, search } = req.query;

  let query = { user: req.user.id };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: "i" };

  const tasks = await Task.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    count: tasks.length,
    data: tasks,
  });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.user.toString() !== req.user.id) {
    return next(new AppError("Not authorized to update this task", 403));
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.user.toString() !== req.user.id) {
    return next(new AppError("Not authorized to delete this task", 403));
  }

  await task.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
    data: {},
  });
});
