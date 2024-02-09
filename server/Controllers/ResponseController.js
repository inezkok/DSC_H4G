const Response = require('../Models/ResponseModel');
const RegisterForm = require('../Models/RegisterFormModel');
const FeedbackForm = require('../Models/FeedbackFormModel');
const Activity = require('../Models/ActivityModel');
const Session = require('../Models/SessionModel');
const User = require('../Models/UserModel');

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

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
    const { answers, sessionDate } = req.body;

    let feedbackFormId = null;

    try {
        // dont need to check if the response already exists, 
        // since user can submit multiple responses (for same feedback form, same register form)

        if (answers.length <= 0) {
            return res.status(400).json({
                success: false,
                message: "Answers is empty",
            });
        }

        // create or update session
        const activity = await Activity.findOne({ registerForm: regFormId });
        const existingSession = await Session.findOne({ 
            activityId: activity._id,
            sessionDate: sessionDate
        });

        if (existingSession) {
            const maxCapacity = activity.capacity;
            const currentCapacity = existingSession.volunteers.length;

            // check if session is full
            if (currentCapacity >= maxCapacity) {
                return res.status(500).json({
                    success: false,
                    message: "Session is full",
                });
            }

            // check if user already registered for this session
            if (existingSession.volunteers.includes(userId)) {
                return res.status(500).json({
                    success: false,
                    message: "User already registered for this session",
                });
            }

            // update session and user
            await Session.findByIdAndUpdate(existingSession._id, {
                $push: { volunteers: userId }
            }, { new: true });

            await User.findByIdAndUpdate(userId, {
                $push: { sessions: existingSession._id }
            }, { new: true });

            feedbackFormId = existingSession.feedbackForm;
        } else {
            // create new session
            const newSession = await Session.create({
                activityId: activity._id,
                sessionDate: sessionDate,
                volunteers: [userId]
            });

            // create feedback form for the session
            const feedbackForm = await FeedbackForm.create({
                sessionId: newSession._id,
                description: "Volunteer Feedback Form for " + activity.title + " , " + formatDate(sessionDate),
                questions: [{
                    questionText: "Rate how convenient was the sign up process. (Inconvenient 1 to Very Convenient 5)",
                    options: [{value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}]
                }, {
                    questionText: "Rate how much of an impact do you feel the volunteer work had on you. (No impact 1 to Great impact 5)",
                    options: [{value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}]
                }, {
                    questionText: "Rate how easy was it for you to get along with the others in the midst of your volunteer work. (Not easy 1 to Very easy 5)",
                    options: [{value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}]
                }, {
                    questionText: "Rate what is your overall satisfaction on volunteer with GUI (Very dissatisfied 1 to Super satisfied)",
                    options: [{value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}]
                }, {
                    questionText: "Rate how likely is it that you would recommend others to volunteer with GUI? (Very unlikely 1 to Extremely likely 5",
                    options: [{value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}]
                }, {
                    questionText: "What more can we do for you in strengthening GUI Volunteer Community?",
                    options: [{value: "Encourage interest groups"}, {value: "Provide learning opportunities"}, {value: "Organise potluck sessions"}, {value: "Send regular updates"}]
                }]
            })

            // update session with feedback form
            const updatedSession = await Session.findByIdAndUpdate(newSession._id, {
                feedbackForm: feedbackForm._id
            }, { new: true });

            feedbackFormId = updatedSession.feedbackForm;

            // update activity and user with session
            await Activity.findByIdAndUpdate(activity._id, {
                $push: { sessions: updatedSession._id }
            }, { new: true });

            await User.findByIdAndUpdate(userId, {
                $push: { sessions: updatedSession._id }
            }, { new: true });
        }

        // create response with corresponding feedback form
        const response = await Response.create({ regFormId, feedbackFormId, userId, answers });

        await RegisterForm.findByIdAndUpdate(regFormId, {
            $push: { sessionDates: sessionDate }
        }, { new: true })

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

// delete response (probs not needed, but just in case)
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

// update response (probs not needed, but just in case)
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