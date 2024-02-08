const Response = require('../Models/ResponseModel');

// create feedback response
module.exports.createFeedbackResponse = async (req, res) => {
    const { feedbackFormId, userId } = req.params;
    const { answers, createdAt } = req.body;

    try {
        // dont need to check if the response already exists, 
        // since user can submit multiple responses (for same feedback form, same register form)

        if (answers.length <= 0) {
            return res.status(400).json({
                success: false,
                message: "Answers is empty",
            });
        }

        const response = await Response.create({ feedbackFormId, userId, answers, createdAt });
        res.status(200).json({
            success: true,
            message: "Feedback Response is created",
            data: response,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Feedback Response is not created",
            error: err,
        });
    };
};

// create register response
module.exports.createRegisterResponse = async (req, res) => {
    const { regFormId, userId } = req.params;
    const { answers, createdAt } = req.body;

    try {
        // dont need to check if the response already exists, 
        // since user can submit multiple responses (for same feedback form, same register form)

        if (answers.length <= 0) {
            return res.status(400).json({
                success: false,
                message: "Answers is empty",
            });
        }

        const response = await Response.create({ regFormId, userId, answers, createdAt });
        res.status(200).json({
            success: true,
            message: "Register Response is created",
            data: response,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Register Response is not created",
            error: err,
        });
    };
};

// delete response
module.exports.deleteResponse = async (req, res) => {
    const responseId = req.params.responseId;

    try {
        const deletedResponse = await Response.findByIdAndDelete(responseId);
        res.status(200).json({
            success: true,
            message: "Response is deleted",
            data: deletedResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Response is not deleted",
        });
    }
}

// update response
module.exports.updateResponse = async (req, res) => {
    const responseId = req.params.responseId;

    try {
        const updatedResponse = await Response.findByIdAndUpdate(responseId, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Response is updated",
            data: updatedResponse,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Response is not updated",
        });
    }
}

// get response
module.exports.getResponse = async (req, res) => {
    const responseId = req.params.responseId;

    try {
        const response = await Response.findById(responseId);
        res.status(200).json({
            success: true,
            message: "Response is found",
            data: response,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Response is not found",
        });
    }
}

// get all responses
module.exports.getAllResponses = async (req, res) => {
    try {
        const responses = await Response.find();
        res.status(200).json({
            success: true,
            message: "All responses are found",
            data: responses,
            count: responses.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Responses are not found",
        });
    }
}

// get all responses for a feedback form
module.exports.getAllResponsesForFeedbackForm = async (req, res) => {
    const feedbackFormId = req.params.feedbackFormId;

    try {
        const responses = await Response.find({ feedbackFormId: feedbackFormId });
        res.status(200).json({
            success: true,
            message: "All responses for feedback form are found",
            data: responses,
            count: responses.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Responses for feedback form are not found",
        });
    }
};

// get all responses for a register form
module.exports.getAllResponsesForRegisterForm = async (req, res) => {
    const regFormId = req.params.regFormId;

    try {
        const responses = await Response.find({ regFormId: regFormId });
        res.status(200).json({
            success: true,
            message: "All responses for register form are found",
            data: responses,
            count: responses.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Responses for register form are not found",
        });
    }
};