import { Schema } from "mongoose";

const taskSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    roadmap: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: '2 weeks'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    milestones: [{
        title: String,
        completed: { type: Boolean, default: false },
        dueDate: Date
    }],
    completed: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

export default taskSchema;