const Task = require("../models/taskModel");

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single task by title
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ id });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  console.log("file", req.file)

  try {
    let attachmentPath = ''; // Initialize attachment path variable

    // Check if there is a file attached in the request
    if (req.file && req.file.path) {
      attachmentPath = req.file.path; // Set attachment path if file is attached
    }

    const task = new Task({
      title,
      description,
      attachment: attachmentPath, // Set attachment path in the Task object
      startDate,
      endDate,
    });

    const newTask = await task.save(); // Save the new task
    res.status(201).json(newTask); // Respond with the newly created task
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};
exports.updateTaskById = async (req, res) => {
  const { id } = req.params; // Assuming the ID parameter is passed in the URL
  try {
    const task = await Task.findById(id);
    if (task) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      task.attachment = req.body.attachment || task.attachment;
      task.startDate = req.body.startDate || task.startDate;
      task.endDate = req.body.endDate || task.endDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Delete a task 
exports.deleteTaskById = async (req, res) => {
  const { id } = req.params; // Assuming the ID parameter is passed in the URL
  try {
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      res.json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};