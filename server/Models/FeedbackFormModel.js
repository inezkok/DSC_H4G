const mongoose = require("mongoose");

const feedbackFormSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    sessionDate: {
        type: Date,
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