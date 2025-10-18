import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const KanbanBoard = ({ project, onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    column: 'To Do'
  });

  useEffect(() => {
    loadTasks();
  }, [project._id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks/project/${project._id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        ...newTask,
        project: project._id
      });
      setTasks([...tasks, response.data]);
      setShowCreateTask(false);
      setNewTask({ title: '', description: '', column: 'To Do' });
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const moveTask = async (taskId, newColumn) => {
    try {
      await axios.patch(`${API_BASE_URL}/tasks/${taskId}/move`, {
        column: newColumn,
        order: 0
      });
      
      // Update local state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, column: newColumn } : task
      ));
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const deleteTask = async (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const getTasksByColumn = (columnName) => {
    return tasks.filter(task => task.column === columnName);
  };

  const getColumnColor = (columnName) => {
    const colors = {
      'To Do': 'bg-blue-50 border-blue-200',
      'In Progress': 'bg-yellow-50 border-yellow-200',
      'Done': 'bg-green-50 border-green-200',
      'Backlog': 'bg-gray-50 border-gray-200'
    };
    return colors[columnName] || 'bg-gray-50 border-gray-200';
  };

  const handleSummarize = async () => {
    setAiLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/project/${project._id}/summarize`);
      setAiSummary(response.data.summary);
    } catch (error) {
      setAiSummary('Failed to generate summary. Make sure AI is configured.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/project/${project._id}/ask`, {
        question: aiQuestion
      });
      setAiAnswer(response.data.answer);
      setAiQuestion('');
    } catch (error) {
      setAiAnswer('Failed to get answer. Make sure AI is configured.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const columns = project.columns || [
    { name: 'To Do' },
    { name: 'In Progress' },
    { name: 'Done' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="btn btn-secondary">
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAIPanel(true)}
            className="btn btn-primary"
          >
            🤖 AI Assistant
          </button>
          <button
            onClick={() => setShowCreateTask(true)}
            className="btn btn-primary"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.name} className="flex flex-col">
            <div className={`p-4 rounded-t-lg border ${getColumnColor(column.name)}`}>
              <h3 className="font-semibold text-gray-900">{column.name}</h3>
              <span className="text-sm text-gray-600">
                {getTasksByColumn(column.name).length} tasks
              </span>
            </div>
            
            <div className={`flex-1 p-4 border-l border-r border-b rounded-b-lg min-h-96 ${getColumnColor(column.name)}`}>
              {getTasksByColumn(column.name).map((task) => (
                <div key={task._id} className="card p-4 mb-3 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <button
                      onClick={() => deleteTask(task._id, task.title)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <select
                      value={task.column}
                      onChange={(e) => moveTask(task._id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      {columns.map(col => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {getTasksByColumn(column.name).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={createTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input resize-none"
                    rows="3"
                    placeholder="Enter task description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Column
                  </label>
                  <select
                    value={newTask.column}
                    onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
                    className="input"
                  >
                    {columns.map(column => (
                      <option key={column.name} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">🤖 AI Assistant</h2>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Summary Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Project Summary</h3>
                  <button
                    onClick={handleSummarize}
                    disabled={aiLoading}
                    className="btn btn-primary text-sm"
                  >
                    {aiLoading ? 'Generating...' : 'Generate Summary'}
                  </button>
                </div>
                {aiSummary && (
                  <div className="card p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{aiSummary}</p>
                  </div>
                )}
              </div>

              {/* Q&A Section */}
              <div>
                <h3 className="font-semibold mb-4">Ask a Question</h3>
                <form onSubmit={handleAskQuestion} className="space-y-4">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask about your project, tasks, or progress..."
                    className="input"
                    disabled={aiLoading}
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="btn btn-primary"
                  >
                    {aiLoading ? 'Thinking...' : 'Ask AI'}
                  </button>
                </form>
                
                {aiAnswer && (
                  <div className="card p-4 mt-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{aiAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;