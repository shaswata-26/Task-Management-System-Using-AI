const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks for a project
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, column, project } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get the highest order number for the column
    const lastTask = await Task.findOne({ project, column })
      .sort({ order: -1 });
    
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({
      title,
      description,
      column: column || 'To Do',
      project,
      order
    });

    await task.save();
    
    // Populate project reference
    await task.populate('project');
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, column, order } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, column, order },
      { new: true, runValidators: true }
    ).populate('project');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

// Move task to different column
exports.moveTask = async (req, res) => {
  try {
    const { column, order } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { column, order },
      { new: true }
    ).populate('project');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to move task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Reorder tasks in a column
exports.reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { id, order } objects
    
    const bulkOps = tasks.map(task => ({
      updateOne: {
        filter: { _id: task.id },
        update: { order: task.order }
      }
    }));

    await Task.bulkWrite(bulkOps);
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reorder tasks' });
  }
};