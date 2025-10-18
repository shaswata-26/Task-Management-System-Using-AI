import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectList from './components/ProjectList';
import KanbanBoard from './components/KanbanBoard';
import './index.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [currentView, setCurrentView] = useState('projects');
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load all projects on app start
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      throw new Error('Failed to create project');
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
      if (currentProject && currentProject._id === projectId) {
        setCurrentView('projects');
        setCurrentProject(null);
      }
    } catch (err) {
      throw new Error('Failed to delete project');
    }
  };

  const openProject = (project) => {
    setCurrentProject(project);
    setCurrentView('kanban');
  };

  const goBackToProjects = () => {
    setCurrentView('projects');
    setCurrentProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              <span>📋</span>
              <span>TaskFlow</span>
            </div>
            
            {currentView === 'kanban' && (
              <button
                onClick={goBackToProjects}
                className="btn btn-secondary"
              >
                ← Back to Projects
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'projects' && (
          <ProjectList
            projects={projects}
            loading={loading}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
            onOpenProject={openProject}
          />
        )}

        {currentView === 'kanban' && currentProject && (
          <KanbanBoard
            project={currentProject}
            onBack={goBackToProjects}
          />
        )}
      </main>
    </div>
  );
}

export default App;