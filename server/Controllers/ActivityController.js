const Activity = require("../Models/ActivityModel");

// create activity
module.exports.createActivity = async (req, res) => {
    const user = req.params.user;
    const { title, schedule, date, location } = req.body;

    try {
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            })
        }

        const activity = await Activity.create({
            user: user,
            title: title,
            schedule: schedule,
            date: date,
            location: location,
        });

        res.status(200).json({
            success: true,
            message: "Activity is created",
            data: activity,
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

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

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