const Activity = require("../Models/ActivityModel");
const RegisterForm = require("../Models/RegisterFormModel");
const FeedbackForm = require("../Models/FeedbackFormModel");
const Response = require("../Models/ResponseModel");
const Session = require("../Models/SessionModel");
const User = require("../Models/UserModel");

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

// create activity
module.exports.createActivity = async (req, res) => {
    const { title, scheduleDays, scheduleTime, location, capacity } = req.body;

    try {
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            })
        }

        const existingActivity = await Activity.findOne({title, scheduleDays, scheduleTime, location, capacity});
        if (existingActivity) {
            return res.status(400).json({
                success: false,
                message: "Activity already exists",
            })
        }

        const activity = await Activity.create({
            title: title,
            scheduleDays: scheduleDays,
            scheduleTime: scheduleTime,
            location: location,
            capacity: capacity,
        });

        const registerForm = await RegisterForm.create({
            activityId: activity._id,
            description: "Volunteer Registration Form for " + title,
            questions: [{
                questionText: "Please indicate your preferred communication means.",
                options: [{value: "Telegram"}, {value: "WhatsApp"}]
            }, {
                questionText: "By filling up this form, you allow GUI to share your details with our supervisors and/or where needed, keep in contact, use your pictures for social media/website and you agree to indemnify GUI from being responsible for any injury or liability incurred during your stay at Kampung Kampus, home of GUI.",
                options: [{value: "Yes"}]
            }, {
                questionText: "Kampung lunch is available on Saturdays GBK. It is plant-based. A contribute-what-feels-right amount is encouraged to sustain the kitchen operation. Would you want to order lunch?",
                options: [{value: "Yes, please!"}, {value: "No, it's okay"}, {value: "Yes, but I have food allergies"}]
            }],
        });

        const updatedActivity = await Activity.findByIdAndUpdate(activity._id, {
            registerForm: registerForm._id
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Activity is created",
            data: updatedActivity,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not created",
        })
    }
};

// delete activity
module.exports.deleteActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedActivity = await Activity.findByIdAndDelete(id);
        await RegisterForm.findByIdAndDelete(deletedActivity.registerForm);
        await Response.deleteMany({ regFormId: deletedActivity.registerForm});

        // delete future sessions and feedback forms that are associated with the activity
        const sessions = await Session.find({ activityId: id}).exec();
        const sessionsToDeleteId = sessions.filter(session => {
            return new Date(session.sessionDate) > new Date()
        }).map(session => session._id);
        
        await Session.deleteMany({ _id: { $in: sessionsToDeleteId }});
        await FeedbackForm.deleteMany({ sessionId: { $in: sessionsToDeleteId }});
        await Activity.updateMany({}, {
            $pull: { sessions: { $in: sessionsToDeleteId } }
        });
        await User.updateMany({}, {
            $pull: { sessions: { $in: sessionsToDeleteId } }
        });

        res.status(200).json({
            success: true,
            message: "Activity is deleted",
            data: deletedActivity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not deleted",
            error: err.message,
        })
    }
};

// update activity
module.exports.updateActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        await RegisterForm.findByIdAndUpdate(updatedActivity.registerForm, {
            $set: { description: "Volunteer Registration Form for " + updatedActivity.title}
        }, { new: true });


        const dayNumbers = updatedActivity.scheduleDays.map(day => 
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
        );
        
        // delete future sessions and feedback forms that are not in scheduleDays or have more volunteers than capacity
        const sessions = await Session.find({_id: { $in: updatedActivity.sessions }}).exec();

        const sessionsToDeleteIds = sessions.filter(s => {
            const d = new Date(s.sessionDate);
            return d > new Date() || 
                !dayNumbers.includes(d.getDay()) || 
                s.volunteers.length > updatedActivity.capacity
        }).map(session => session._id);

        const sessionDatesToDelete = sessions.filter(s => {
            const d = new Date(s.sessionDate);
            return d > new Date() || 
                !dayNumbers.includes(d.getDay()) || 
                s.volunteers.length > updatedActivity.capacity
        }).map(session => session.sessionDate);

        await Session.deleteMany({ _id: { $in: sessionsToDeleteIds }});
        await FeedbackForm.deleteMany({ sessionId: { $in: sessionsToDeleteIds }});
        await RegisterForm.findByIdAndUpdate(updatedActivity.registerForm, { 
            $pull: { sessionDates: { $in: sessionDatesToDelete } }
        }, { new: true });
        await Response.deleteMany({ regFormId: updatedActivity.registerForm });
        await Activity.updateMany({}, {
            $pull: { sessions: { $in: sessionsToDeleteIds } }
        });
        await User.updateMany({}, {
            $pull: { sessions: { $in: sessionsToDeleteIds } }
        });

        res.status(200).json({
            success: true,
            message: "Activity is updated",
            data: updatedActivity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not updated",
            error: err.message,
        })
    }
};

// get single activity
module.exports.getActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await Activity.findById(id);

        res.status(200).json({
            success: true,
            message: "Activity is found",
            data: activity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not found",
        })
    }
};

// get all activities
module.exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find();
        
        res.status(200).json({
            success: true,
            message: "All Activities are found",
            data: activities,
            count: activities.length,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activities are not found." + err.message,
        })
    }
};