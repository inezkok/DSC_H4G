const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Form name is required"],
    },
    description: {
        type: String,
        default: ""
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }],
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

module.exports = mongoose.model("Form", formSchema); 