const Form = require('../Models/FormModel');
const Question = require('../Models/QuestionModel');
const Answer = require('../Models/AnswerModel');

// create form
module.exports.createForm = async (req, res) => {
    const { name, description, questions } = req.body;

    try {
        const form = await Form.create({ name, description, questions });

        res.status(200).json({
            success: true,
            message: "Form is created",
            data: form,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Form is not created",
        });
    }
}

// delete form
module.exports.deleteForm = async (req, res) => {
    const id = req.params.id;

    try {
        await Question.deleteMany({ formId: id });
        await Answer.deleteMany({ formId: id });
        const deletedForm = await Form.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Form is deleted",
            data: deletedForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Form is not deleted",
            error: err,
        });
    }
}

// update form
module.exports.updateForm = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedForm = await Form.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Form is updated",
            data: updatedForm,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Form is not updated",
        });
    }
};

// get form
module.exports.getForm = async (req, res) => {
    const id = req.params.id;

    try {
        const form = await Form.findById(id);

        res.status(200).json({
            success: true,
            message: "Form is found",
            data: form,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Form is not found",
        });
    }
};

// get all forms
module.exports.getForms = async (req, res, next) => {
    try {
        const forms = await Form.find();

        res.status(200).json({
            success: true,
            message: "All forms are found",
            data: forms,
            count: forms.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all forms",
        });
        next();
    }
};