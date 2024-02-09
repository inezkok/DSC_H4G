const mongoose = require("mongoose");

const emptyObjectId = new mongoose.Types.ObjectId('000000000000000000000000');

const responseSchema = new mongoose.Schema({
    regFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterForm",
        default: emptyObjectId,
        required: true
    },
    feedbackFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeedbackForm",
        default: emptyObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [{
        questionId: String,
        optionId: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Response", responseSchema);