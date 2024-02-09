const Impact = require("../Models/ImpactModel");

// create impact
module.exports.createImpact = async (req, res) => {
    const { howYouHeard, totalFundsRaised, totalVolunteers, totalReturningVolunteers, totalSessions, totalBeneficiaries } = req.body;

    try {
        const impact = await Impact.create({ howYouHeard, totalFundsRaised, totalVolunteers, totalReturningVolunteers, totalSessions, totalBeneficiaries });

        res.status(200).json({
            success: true,
            message: "Impact is created",
            data: impact,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Impact is not created",
        });
    }
};

// delete impact (might not be used)
module.exports.deleteImpact = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedImpact = await Impact.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Impact is deleted",
            data: deletedImpact,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Impact is not deleted",
        });
    }
};

// update impact
module.exports.updateImpact = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedImpact = await Impact.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Impact is updated",
            data: updatedImpact,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Impact is not updated",
        });
    }
};

// get single impact
module.exports.getImpact = async (req, res) => {
    const id = req.params.id;

    try {
        const impact = await Impact.findById(id);

        res.status(200).json({
            success: true,
            message: "Impact is found",
            data: impact,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Impact is not found",
        });
    };
};

// get all impacts (might not be used)
module.exports.getAllImpacts = async (req, res) => {
    try {
        const impacts = await Impact.find();

        res.status(200).json({
            success: true,
            message: "Impacts are found",
            data: impacts,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Impacts are not found",
        });
    }
};