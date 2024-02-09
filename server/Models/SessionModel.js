const mongoose = require("mongoose");

const emptyObjectId = new mongoose.Types.ObjectId('000000000000000000000000');

const sessionSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    sessionDate: {
        type: Date,
        required: true,
    },
    volunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    feedbackForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeedbackForm",
        default: emptyObjectId,
        required: true
    }
});

module.exports = mongoose.model("Session", sessionSchema);