Project & Task Management System with AI
A full-stack Project and Task Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and integrated with Google's Gemini AI for intelligent project insights and task management.
🌟 Features
Project Management
✅ Create, read, update, and delete projects

✅ Project descriptions and metadata

✅ Organized project listing with creation dates

Task Management
✅ Create, read, update, and delete tasks

✅ Drag-and-drop task movement between columns

✅ Task descriptions and status tracking

✅ Visual Kanban board interface

AI-Powered Insights
✅ Project Summarization: Get AI-generated summaries of your projects

✅ Smart Q&A: Ask questions about your projects and tasks

✅ Gemini AI Integration: Powered by Google's latest AI technology

User Experience
✅ Trello-like Interface: Intuitive drag-and-drop Kanban board

✅ Responsive Design: Works seamlessly on desktop and mobile

✅ Real-time Updates: Instant synchronization across the application

✅ Clean UI: Modern interface built with TailwindCSS
🛠️ Tech Stack
Frontend
React.js - Frontend framework

TailwindCSS - Utility-first CSS framework

Axios - HTTP client for API calls

React Router - Client-side routing

Backend
Node.js - Runtime environment

Express.js - Web application framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

AI Integration
Google Gemini AI - AI-powered insights and summarization

Google Generative AI SDK - Official Google AI client

🚀 Quick Start
Prerequisites
Node.js (v18 or higher)

MongoDB (local or MongoDB Atlas)

Google Gemini API key

Installation
Clone the repository

bash
git clone https://github.com/yourusername/project-task-manager.git
cd project-task-manager
Backend Setup

bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configurations
Frontend Setup

bash
cd ../frontend
npm install
Environment Variables

Backend (.env)

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project_task_manager
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
Frontend (.env)

env
REACT_APP_API_URL=http://localhost:5000/api
Run the Application

Start Backend (Terminal 1)

bash
cd backend
npm run dev
Start Frontend (Terminal 2)

bash
cd frontend
npm start
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000/api

project-task-manager/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── context/     # React context
    │   └── App.js       # Main App component
    └── package.json


    🎯 API Endpoints
Projects
GET /api/projects - Get all projects

GET /api/projects/:id - Get single project with tasks

POST /api/projects - Create new project

PUT /api/projects/:id - Update project

DELETE /api/projects/:id - Delete project

Tasks
GET /api/tasks/project/:projectId - Get tasks by project

POST /api/tasks - Create new task

PUT /api/tasks/:id - Update task

PATCH /api/tasks/:id/move - Move task between columns

DELETE /api/tasks/:id - Delete task

AI Features
GET /api/ai/project/:projectId/summarize - Get AI project summary

POST /api/ai/project/:projectId/ask - Ask AI question about project

🤖 AI Integration
This project integrates with Google's Gemini AI to provide:

Project Summarization
Get concise AI-generated summaries of your projects including:

Overall project status

Task distribution across columns

Key insights and patterns

Intelligent Q&A
Ask natural language questions about your projects:

"What tasks are currently in progress?"

"Which tasks are behind schedule?"

"What's the overall progress of this project?"

Setup AI
Get your API key from Google AI Studio

Add it to your backend .env file:

env
GEMINI_API_KEY=your_actual_api_key_here
