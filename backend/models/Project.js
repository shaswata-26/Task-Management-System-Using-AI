const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  columns: [{
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Add default columns when project is created
projectSchema.pre('save', function(next) {
  if (this.isNew && this.columns.length === 0) {
    this.columns = [
      { name: 'To Do', order: 0 },
      { name: 'In Progress', order: 1 },
      { name: 'Done', order: 2 }
    ];
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);