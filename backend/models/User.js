import mongoose, { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import taskSchema from './taskSchema.js';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
  streak: {
    type: Number,
    default: 0
  },
  lastCheckinDate: {
    type: Date,
    default: null
  },
  groups: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
  }],
  tasks: [taskSchema],
  checkinHistory: [{
    date: {
      type: Date,
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
