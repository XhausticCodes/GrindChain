import { Schema, model } from 'mongoose';

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  avatar: {
    type: String,
    default: null
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  admins: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  goal: { 
    type: Schema.Types.ObjectId, 
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

export default model('Group', groupSchema);