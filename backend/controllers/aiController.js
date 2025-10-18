const Project = require('../models/Project');
const Task = require('../models/Task');
const geminiAI = require('../utils/geminiAI');

// Summarize project tasks
exports.summarizeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId });
    
    if (tasks.length === 0) {
      return res.json({ summary: 'No tasks available for summarization.' });
    }

    const summary = await geminiAI.summarizeProject(project, tasks);
    res.json({ summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate project summary' });
  }
};

// Answer question about project
exports.answerQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId });
    
    const answer = await geminiAI.answerQuestion(question, project, tasks);
    res.json({ question, answer });
  } catch (error) {
    console.error('AI Q&A Error:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
};