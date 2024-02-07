const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    value: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

answerSchema.index({ formId: 1, questionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Answer", answerSchema); 