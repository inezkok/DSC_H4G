const Session = require("../Models/SessionModel");
const Activity = require("../Models/ActivityModel");
const FeedbackForm = require("../Models/FeedbackFormModel");
const Response = require("../Models/ResponseModel");
const User = require("../Models/UserModel");

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

// create session
module.exports.createSession = async (req, res) => {
    const activityId = req.params.activityId
    const { sessionDate } = req.body; // check whether session date falls within activity schedule on frontend

    try {
        const activity = await Activity.findById(activityId);

        const existingSession = await Session.findOne({ activityId, sessionDate });
        if (existingSession) {
            return res.status(400).json({
                success: false,
                message: "Session already exists",
            });
        }

        const session = await Session.create({
            activityId,
            sessionDate
        });

        const feedbackForm = await FeedbackForm.create({
            sessionId: session._id,
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
        });

        const updatedSession = await Session.findByIdAndUpdate(session._id, {
            feedbackForm: feedbackForm._id
        }, { new: true });

        await Activity.findByIdAndUpdate(activityId, {
            $push: { sessions: updatedSession._id }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Session is created",
            data: updatedSession,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Session is not created",
            error: err.message,
        });
    }
}

// delete session
module.exports.deleteSession = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSession = await Session.findByIdAndDelete(id);
        await Activity.updateMany({ $pull: { sessions: deletedSession._id } });
        await FeedbackForm.findByIdAndDelete(deletedSession.feedbackForm);
        await Response.deleteMany({ feedbackFormId: deletedSession.feedbackForm });
        await User.updateMany({ $pull: { sessions: deletedSession._id } });

        res.status(200).json({
            success: true,
            message: "Session is deleted",
            data: deletedSession,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Session is not deleted",
        });
    }
};

// update session
module.exports.updateSession = async (req, res) => {
    const { id } = req.params;
    const sessionDate = req.body.sessionDate;

    try {
        const updatedSession = await Session.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        const activity = await Activity.findById(updatedSession.activityId);
        await FeedbackForm.findByIdAndUpdate(updatedSession.feedbackForm, {
            description: "Volunteer Feedback Form for " + activity.name + " , " + formatDate(sessionDate),
        });

        res.status(200).json({
            success: true,
            message: "Session is updated",
            data: updatedSession,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Session is not updated",
            error: err.message,
        });
    }
}

// get session
module.exports.getSession = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await Session.findById(id);

        res.status(200).json({
            success: true,
            message: "Session is found",
            data: session,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Session is not found",
        });
    }
}

// get all sessions
module.exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();

        res.status(200).json({
            success: true,
            message: "Sessions are found",
            data: sessions,
            count: sessions.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Sessions are not found",
        });
    }
}

// get all sessions by activity
module.exports.getAllSessionsByActivity = async (req, res) => {
    const { activityId } = req.params;

    try {
        const sessions = await Session.find({ activityId });

        res.status(200).json({
            success: true,
            message: "Activity sessions are found",
            data: sessions,
            count: sessions.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Activity sessions are not found",
        });
    }
}

// get all sessions by volunteer
module.exports.getAllSessionsByVolunteer = async (req, res) => {
    const { volunteerId } = req.params;

    try {
        const sessions = await Session.find({ volunteers: { $in: [volunteerId] } });

        res.status(200).json({
            success: true,
            message: "Volunteer sessions are found",
            data: sessions,
            count: sessions.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Volunteer sessions are not found",
        });
    }
}