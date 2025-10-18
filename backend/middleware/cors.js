const cors = require('cors');

const corsOptions = {
  origin: 'https://task-management-system-using-ai-1.onrender.com', // ✅ your frontend domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

module.exports = cors(corsOptions);