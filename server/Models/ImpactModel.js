const mongoose = require("mongoose");

const impactSchema = new mongoose.Schema({
    howYouHeard: {
        type: [{
            name: String,
            count: Number
        }],
        default: [
            { name: "GUI Website", count: 0 },
            { name: "Giving.sg", count: 0 },
            { name: "GUI Facebook", count: 0 },
            { name: "GUI Instagram", count: 0 },
            { name: "GUI Telegram", count: 0 },
            { name: "GUI Electronic Direct Mail (EDM)", count: 0 },
            { name: "MFS CS Placement", count: 0 },
            { name: "Kins/Friends who experienced GUI", count: 0 }
        ],
        required: true
    },
    totalFundsRaised: {
        type: Number,
        default: 0,
        required: true
    },
    totalVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    totalReturningVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    totalSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }],
    totalBeneficiaries: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Impact", impactSchema);