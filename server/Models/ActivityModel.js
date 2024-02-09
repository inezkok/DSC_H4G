const mongoose = require("mongoose");

const emptyObjectId = new mongoose.Types.ObjectId('000000000000000000000000');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    scheduleDays: {
        type: [String],
        default: [],
        required: true,
    },
    scheduleTime: {
        type: String,
        default: "",
        required: true,
    },
    location: {
        type: String,
    },
    capacity: {
        type: Number,
        required: true,
    },
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    }],
    registerForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterForm",
        default: emptyObjectId,
        required: true,
    }
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model("Activity", activitySchema);