const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group',
    required: true
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'checkin', 'goal', 'system'],
    default: 'text'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);