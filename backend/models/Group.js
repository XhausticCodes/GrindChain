const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  admins: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  goal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Goal' 
  },
  streakCount: {
    type: Number,
    default: 0
  },
  brokenDates: [Date],
  isActive: {
    type: Boolean,
    default: true
  },
  joinCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);