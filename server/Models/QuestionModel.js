const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
    },
    title: {
        type: String,
        required: [true, "Question title is required"],
    },
    type: {
        type: String,
        enum: ["text", "mcq", "checkboxes", "date"],
        default: "text",
        required: true,
    },
    options: {
        type: [String],
        default: [],
        required: true,
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
    }],
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

module.exports = mongoose.model("Question", questionSchema); 