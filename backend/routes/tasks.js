const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/project/:projectId', taskController.getTasksByProject);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/move', taskController.moveTask);
router.post('/reorder', taskController.reorderTasks);
router.delete('/:id', taskController.deleteTask);

module.exports = router;