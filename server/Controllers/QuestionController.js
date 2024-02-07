const Form = require('../Models/FormModel');
const Question = require('../Models/QuestionModel');
const Answer = require('../Models/AnswerModel');

// create question
module.exports.createQuestion = async (req, res) => {
    const formId = req.params.formId;
    const { title, type, options, answers } = req.body;

    try {
        const question = await Question.create({ formId, title, type, options, answers});

        await Form.findByIdAndUpdate(formId, {
            $push: { questions: question._id },
        })

        res.status(200).json({
            success: true,
            message: "Question is created",
            data: question,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Question is not created",
        });
    }
}

// delete question
module.exports.deleteQuestion = async (req, res) => {
    const formId = req.params.formId;
    const id = req.params.id;

    try {
        await Answer.deleteMany({ questionId: id });
        await Form.findByIdAndUpdate(formId, {
            $pull: { questions: id },
        });
        const deletedQuestion = await Question.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Question is deleted",
            data: deletedQuestion,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Question is not deleted",
            error: err,
        });
    }
}

// update question
module.exports.updateQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Question is updated",
            data: updatedQuestion,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Question is not updated",
        });
    }
};

// get question
module.exports.getQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await Question.findById(id);

        res.status(200).json({
            success: true,
            message: "Question is found",
            data: question,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Question is not found",
        });
    }
};

// get all questions
module.exports.getQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();

        res.status(200).json({
            success: true,
            message: "All questions are found",
            data: questions,
            count: questions.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all questions",
        });
        next();
    }
};

// get all questions of a form
module.exports.getQuestionsOfForm = async (req, res, next) => {
    const formId = req.params.formId;

    try {
        const questions = await Question.find({ formId: formId });

        res.status(200).json({
            success: true,
            message: "All questions of the form are found",
            data: questions,
            count: questions.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all questions of the form",
        });
        next();
    }
};