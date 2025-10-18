const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/project/:projectId/summarize', aiController.summarizeProject);
router.post('/project/:projectId/ask', aiController.answerQuestion);

module.exports = router;