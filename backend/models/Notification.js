import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['checkin_reminder', 'group_invite', 'streak_broken', 'goal_deadline', 'member_joined'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  relatedGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);