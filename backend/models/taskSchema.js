import { Schema, model } from "mongoose";

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
    completed: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

export default taskSchema;