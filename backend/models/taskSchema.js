import mongoose from 'mongoose';

const roadmapItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false }
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  platform: { type: String, enum: ['GeeksForGeeks', 'PW'], required: true },
  type: { type: String, enum: ['free', 'paid'], required: true },
  description: String
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  duration: String,
  roadmap: String,
  roadmapItems: [roadmapItemSchema],
  milestones: [milestoneSchema],
  resources: {
    free: [resourceSchema],
    paid: [resourceSchema]
  },
  aiGenerated: { type: Boolean, default: false },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  completed: { type: Boolean, default: false },
  UserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isGroupTask: { type: Boolean, default: false },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group'
  },
  taskHeaders: [{
    title: { type: String, required: true },
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    subtasks: [{
      text: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }]
  }]
}, {
  timestamps: true
});

export default taskSchema;