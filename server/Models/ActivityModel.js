const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        schedule: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
        },
        location: {
            type: String,
        }
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model("Activity", activitySchema);