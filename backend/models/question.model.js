import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    note: {
        type: String,
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    explanation: {
        title: { type: String, default: '' },
        explanation: { type: String, default: '' },
    },
    answerTip: {
        type: String,
        default: '',
    }
    
}, {timestamps: true})

const Question = mongoose.model("Question", questionSchema)

export default Question
