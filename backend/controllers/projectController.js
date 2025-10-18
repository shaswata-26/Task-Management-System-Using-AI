const Project = require('../models/Project');
const Task = require('../models/Task');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get single project with tasks
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.id }).sort({ order: 1 });
    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, columns } = req.body;
    
    const project = new Project({
      name,
      description,
      columns
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, columns } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, columns },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update project' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};