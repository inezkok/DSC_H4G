const FeedbackForm = require('../Models/FeedbackFormModel');
const Response = require('../Models/ResponseModel');

// create feedback form
module.exports.createFeedbackForm = async (req, res) => {
    const activityId = req.params.activityId;
    const { sessionDate, name, description, questions, createdAt } = req.body;

    try {
        const existingFeedbackForm = await FeedbackForm.findOne({ activityId, sessionDate });
        if (existingFeedbackForm) {
            return res.status(400).json({
                success: false,
                message: "Feedback form already exists",
            });
        }

        const feedbackForm = await FeedbackForm.create({ activityId, sessionDate, name, description, questions, createdAt });

        res.status(200).json({
            success: true,
            message: "Feedback form is created",
            data: feedbackForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Feedback form is not created",
        });
    }
};

// delete feedback form
module.exports.deleteFeedbackForm = async (req, res) => {
    const feedbackFormId = req.params.feedbackFormId;

    try {
        await Response.deleteMany({ feedbackFormId: feedbackFormId });
        const deletedFeedbackForm = await FeedbackForm.findByIdAndDelete(feedbackFormId);

        res.status(200).json({
            success: true,
            message: "Feedback form is deleted",
            data: deletedFeedbackForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Feedback form is not deleted",
        });
    }
}


// update feedback form
module.exports.updateFeedbackForm = async (req, res) => {
    const feedbackFormId = req.params.feedbackFormId;

    try {
        const updatedFeedbackForm = await FeedbackForm.findByIdAndUpdate(feedbackFormId, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Feedback form is updated",
            data: updatedFeedbackForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Feedback form is not updated",
        });
    }
};

// get feedback form
module.exports.getFeedbackForm = async (req, res) => {
    const feedbackFormId = req.params.feedbackFormId;

    try {
        const feedbackForm = await FeedbackForm.findById(feedbackFormId);

        res.status(200).json({
            success: true,
            message: "Feedback form is found",
            data: feedbackForm,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Feedback form is not found",
        });
    }
};

// get all feedback forms
module.exports.getAllFeedbackForms = async (req, res) => {
    try {
        const feedbackForms = await FeedbackForm.find();

        res.status(200).json({
            success: true,
            message: "Feedback forms are found",
            data: feedbackForms,
            count: feedbackForms.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Feedback forms are not found",
        });
    }
};