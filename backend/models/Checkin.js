const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group',
    required: true
  },
  goal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Goal'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: { 
    type: String, 
    enum: ['completed', 'missed', 'partial'],
    required: true
  },
  message: {
    type: String,
    maxlength: 500,
    default: ''
  },
  proof: {
    type: String, // URL to image/file
    default: null
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

checkinSchema.index({ user: 1, group: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);