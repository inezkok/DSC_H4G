const Activity = require("../Models/ActivityModel");
const RegisterForm = require("../Models/RegisterFormModel");
const Response = require("../Models/ResponseModel");
const Session = require("../Models/SessionModel");

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
        await Session.deleteMany({ activityId: id });

        res.status(200).json({
            success: true,
            message: "Activity is deleted",
            data: deletedActivity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not deleted",
        })
    }
};

// update activity
module.exports.updateActivity = async (req, res) => {
    const { id } = req.params;
    const { title, scheduleDays, scheduleTime, location, capacity } = req.body;

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        const dayNumbers = scheduleDays.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
        
        const sessionsToDelete = await Session.find({ activityId: id}).lean().exec();
        const sessionsToDeleteIds = sessionsToDelete.filter(session => {
            const sessionDay = session.sessionDate.getDay();
            const sessionSize = session.volunteers.length;
            // check if session day is not in scheduleDays and session size is greater than capacity
            return !dayNumbers.includes(sessionDay) && sessionSize > capacity;
        }).map(session => session._id);

        await Session.deleteMany({ _id: { $in: sessionsToDeleteIds }});

        res.status(200).json({
            success: true,
            message: "Activity is updated",
            data: updatedActivity,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activity is not updated",
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
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Activities are not found." + err.message,
        })
    }
};