const RegisterForm = require('../Models/RegisterFormModel');
const Response = require('../Models/ResponseModel');

// create register form
module.exports.createRegisterForm = async (req, res) => {
    const activityId = req.params.activityId;
    const { name, description, questions } = req.body;

    try {
        const existingRegisterForm = await RegisterForm.findOne({ activityId });
        if (existingRegisterForm) {
            return res.status(400).json({
                success: false,
                message: "Register form already exists",
            });
        }

        const registerForm = await RegisterForm.create({ activityId, name, description, questions });

        res.status(200).json({
            success: true,
            message: "Register form is created",
            data: registerForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Register form is not created",
            error: err,
        });
    }
};

// delete register form
module.exports.deleteRegisterForm = async (req, res) => {
    const regFormId = req.params.regFormId;

    try {
        await Response.deleteMany({ regFormId: regFormId });
        const deletedRegisterForm = await RegisterForm.findByIdAndDelete(regFormId);

        res.status(200).json({
            success: true,
            message: "Register form is deleted",
            data: deletedRegisterForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Register form is not deleted",
        });
    }
}

// update register form
module.exports.updateRegisterForm = async (req, res) => {
    const regFormId = req.params.regFormId;

    try {
        const updatedRegisterForm = await RegisterForm.findByIdAndUpdate(regFormId, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Register form is updated",
            data: updatedRegisterForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Register form is not updated",
        });
    }
};

// get register form
module.exports.getRegisterForm = async (req, res) => {
    const regFormId = req.params.regFormId;

    try {
        const registerForm = await RegisterForm.findById(regFormId);

        res.status(200).json({
            success: true,
            message: "Register form is found",
            data: registerForm,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Register form is not found",
        });
    }
};

// get all register forms
module.exports.getAllRegisterForms = async (req, res) => {
    try {
        const registerForms = await RegisterForm.find();

        res.status(200).json({
            success: true,
            message: "Register forms are found",
            data: registerForms,
            count: registerForms.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Register forms are not found",
        });
    }
};