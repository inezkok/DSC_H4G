const mongoose = require("mongoose");

const feedbackFormSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    name: {
        type: String,
        default: "Volunteer Feedback Form",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        questionText: String,
        options: [{
            value: String
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("FeedbackForm", feedbackFormSchema);