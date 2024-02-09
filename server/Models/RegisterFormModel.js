const mongoose = require("mongoose");

const registerFormSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    name: {
        type: String,
        default: "Volunteer Registration Form",
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
    sessionDates: {
        type: [Date],
        default: [],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("RegisterForm", registerFormSchema);