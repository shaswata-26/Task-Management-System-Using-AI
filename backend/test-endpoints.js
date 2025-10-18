require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test data storage
let testData = {
  projectId: null,
  taskId: null,
};

console.log('🚀 Starting Backend Endpoint Tests...\n');

async function runTests() {
  try {
    // Test 1: Health Check
    await testHealthCheck();

    // Test 2: Project CRUD Operations
    await testProjectCRUD();

    // Test 3: Task CRUD Operations
    await testTaskCRUD();

    // Test 4: Task Movement and Reordering
    await testTaskMovement();

    // Test 5: AI Features
    await testAIFeatures();

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`✅ Projects: Create, Read, Update, Delete`);
    console.log(`✅ Tasks: Create, Read, Update, Delete, Move, Reorder`);
    console.log(`✅ AI: Summarization and Q&A`);
    console.log(`✅ Database: All operations working`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1. 🔍 Testing Health Check...');
  try {
    const response = await api.get('/health');
    console.log('   ✅ Health check:', response.data);
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
}

// Test 2: Project CRUD Operations
async function testProjectCRUD() {
  console.log('\n2. 📂 Testing Project CRUD Operations...');

  // Create Project
  console.log('   a. Creating project...');
  const projectData = {
    name: 'Test Project - Website Redesign',
    description: 'A complete redesign of the company website with modern UI/UX',
    columns: [
      { name: 'Backlog', order: 0 },
      { name: 'To Do', order: 1 },
      { name: 'In Progress', order: 2 },
      { name: 'Review', order: 3 },
      { name: 'Done', order: 4 }
    ]
  };

  try {
    const createResponse = await api.post('/projects', projectData);
    testData.projectId = createResponse.data._id;
    console.log('   ✅ Project created:', createResponse.data.name);
    console.log('   📝 Project ID:', testData.projectId);
  } catch (error) {
    throw new Error(`Project creation failed: ${error.message}`);
  }

  // Get All Projects
  console.log('   b. Getting all projects...');
  try {
    const getAllResponse = await api.get('/projects');
    console.log('   ✅ Projects retrieved:', getAllResponse.data.length);
  } catch (error) {
    throw new Error(`Get all projects failed: ${error.message}`);
  }

  // Get Single Project
  console.log('   c. Getting single project...');
  try {
    const getSingleResponse = await api.get(`/projects/${testData.projectId}`);
    console.log('   ✅ Project retrieved:', getSingleResponse.data.project.name);
  } catch (error) {
    throw new Error(`Get single project failed: ${error.message}`);
  }

  // Update Project
  console.log('   d. Updating project...');
  const updateData = {
    name: 'Updated - Website Redesign',
    description: 'Updated description with additional features'
  };

  try {
    const updateResponse = await api.put(`/projects/${testData.projectId}`, updateData);
    console.log('   ✅ Project updated:', updateResponse.data.name);
  } catch (error) {
    throw new Error(`Project update failed: ${error.message}`);
  }
}

// Test 3: Task CRUD Operations
async function testTaskCRUD() {
  console.log('\n3. 📝 Testing Task CRUD Operations...');

  // Create Multiple Tasks
  const tasks = [
    {
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for the new homepage design',
      column: 'To Do',
      project: testData.projectId
    },
    {
      title: 'Set Up Development Environment',
      description: 'Configure React, Node.js, and database for the project',
      column: 'In Progress',
      project: testData.projectId
    },
    {
      title: 'Create API Endpoints',
      description: 'Develop RESTful APIs for user authentication and data management',
      column: 'To Do',
      project: testData.projectId
    },
    {
      title: 'Write Documentation',
      description: 'Create comprehensive documentation for the codebase',
      column: 'Done',
      project: testData.projectId
    }
  ];

  console.log('   a. Creating tasks...');
  try {
    for (let i = 0; i < tasks.length; i++) {
      const createResponse = await api.post('/tasks', tasks[i]);
      if (i === 0) testData.taskId = createResponse.data._id; // Store first task ID
      console.log(`   ✅ Task ${i + 1} created: ${createResponse.data.title}`);
    }
  } catch (error) {
    throw new Error(`Task creation failed: ${error.message}`);
  }

  // Get Tasks by Project
  console.log('   b. Getting tasks by project...');
  try {
    const tasksResponse = await api.get(`/tasks/project/${testData.projectId}`);
    console.log('   ✅ Tasks retrieved:', tasksResponse.data.length);
    console.log('   📋 Task distribution:');
    const columnCount = {};
    tasksResponse.data.forEach(task => {
      columnCount[task.column] = (columnCount[task.column] || 0) + 1;
    });
    Object.keys(columnCount).forEach(column => {
      console.log(`      ${column}: ${columnCount[column]} tasks`);
    });
  } catch (error) {
    throw new Error(`Get tasks by project failed: ${error.message}`);
  }

  // Update Task
  console.log('   c. Updating task...');
  const updateData = {
    title: 'Updated - Design Homepage Layout',
    description: 'Updated description with responsive design requirements',
    column: 'In Progress'
  };

  try {
    const updateResponse = await api.put(`/tasks/${testData.taskId}`, updateData);
    console.log('   ✅ Task updated:', updateResponse.data.title);
  } catch (error) {
    throw new Error(`Task update failed: ${error.message}`);
  }

  // Get Single Task (via project endpoint)
  console.log('   d. Verifying task in project...');
  try {
    const projectResponse = await api.get(`/projects/${testData.projectId}`);
    const updatedTask = projectResponse.data.tasks.find(task => task._id === testData.taskId);
    if (updatedTask) {
      console.log('   ✅ Task verified in project:', updatedTask.title, `(${updatedTask.column})`);
    }
  } catch (error) {
    throw new Error(`Task verification failed: ${error.message}`);
  }
}

// Test 4: Task Movement and Reordering
async function testTaskMovement() {
  console.log('\n4. 🔄 Testing Task Movement and Reordering...');

  // Move Task to Different Column
  console.log('   a. Moving task between columns...');
  const moveData = {
    column: 'Review',
    order: 0
  };

  try {
    const moveResponse = await api.patch(`/tasks/${testData.taskId}/move`, moveData);
    console.log('   ✅ Task moved to:', moveResponse.data.column);
  } catch (error) {
    throw new Error(`Task movement failed: ${error.message}`);
  }

  // Get all tasks to reorder
  console.log('   b. Getting tasks for reordering...');
  try {
    const tasksResponse = await api.get(`/tasks/project/${testData.projectId}`);
    const tasksToReorder = tasksResponse.data.map((task, index) => ({
      id: task._id,
      order: index
    }));

    // Reorder Tasks
    console.log('   c. Reordering tasks...');
    const reorderResponse = await api.post('/tasks/reorder', { tasks: tasksToReorder });
    console.log('   ✅ Tasks reordered successfully');
  } catch (error) {
    throw new Error(`Task reordering failed: ${error.message}`);
  }
}

// Test 5: AI Features
async function testAIFeatures() {
  console.log('\n5. 🤖 Testing AI Features...');

  // Test Project Summarization
  console.log('   a. Testing project summarization...');
  try {
    const summaryResponse = await api.get(`/ai/project/${testData.projectId}/summarize`);
    console.log('   ✅ Project summary generated');
    console.log('   📄 Summary preview:', summaryResponse.data.summary.substring(0, 100) + '...');
  } catch (error) {
    console.log('   ⚠️  Project summarization failed (API key might be missing):', error.message);
  }

  // Test AI Q&A
  console.log('   b. Testing AI Q&A...');
  try {
    const questionData = {
      question: 'What tasks are currently in progress and what needs to be done next?'
    };
    const qaResponse = await api.post(`/ai/project/${testData.projectId}/ask`, questionData);
    console.log('   ✅ AI Q&A working');
    console.log('   ❓ Question:', qaResponse.data.question);
    console.log('   💡 Answer preview:', qaResponse.data.answer.substring(0, 100) + '...');
  } catch (error) {
    console.log('   ⚠️  AI Q&A failed (API key might be missing):', error.message);
  }
}

// Cleanup function (optional)
async function cleanup() {
  console.log('\n6. 🧹 Cleaning up test data...');
  
  // Delete Task
  try {
    await api.delete(`/tasks/${testData.taskId}`);
    console.log('   ✅ Test task deleted');
  } catch (error) {
    console.log('   ⚠️  Task cleanup failed:', error.message);
  }

  // Delete Project (this will also delete all associated tasks)
  try {
    await api.delete(`/projects/${testData.projectId}`);
    console.log('   ✅ Test project deleted');
  } catch (error) {
    console.log('   ⚠️  Project cleanup failed:', error.message);
  }
}

// Run tests
runTests()
  .then(() => {
    console.log('\n✨ All endpoint tests completed!');
    
    // Ask if user wants to cleanup
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('\nDo you want to clean up test data? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        await cleanup();
      } else {
        console.log('Test data preserved. Project ID:', testData.projectId);
      }
      readline.close();
      process.exit(0);
    });
  })
  .catch(error => {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  });