const Form = require('../Models/FormModel');
const Question = require('../Models/QuestionModel');
const Answer = require('../Models/AnswerModel');

// create answer
module.exports.createAnswer = async (req, res) => {
    const formId = req.params.formId;
    const questionId = req.params.questionId;
    const userId = req.params.userId;
    const { value } = req.body;

    try {
        const answer = await Answer.create({ formId, questionId, userId, value });

        await Question.findByIdAndUpdate(questionId, {
            $push: { answers: answer._id },
        })

        res.status(200).json({
            success: true,
            message: "Answer is created",
            data: answer,
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Answer is already created",
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Answer is not created",
            });
        }
    }
}

// delete answer
module.exports.deleteAnswer = async (req, res) => {
    const questionId = req.params.questionId;
    const id = req.params.id;

    try {
        await Question.findByIdAndUpdate(questionId, {
            $pull: { answers: id },
        });
        const deletedAnswer = await Answer.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Answer is deleted",
            data: deletedAnswer,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Answer is not deleted",
            error: err,
        });
    }
}

// update answer
module.exports.updateAnswer = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedAnswer = await Answer.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Answer is updated",
            data: updatedAnswer,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Answer is not updated",
        });
    }
};

// get answer
module.exports.getAnswer = async (req, res) => {
    const id = req.params.id;

    try {
        const answer = await Answer.findById(id);

        if (!answer) {
            res.status(404).json({
                success: false,
                message: "Answer is not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Answer is found",
            data: answer,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Answer is not found",
        });
    }
};

// get all answers
module.exports.getAnswers = async (req, res, next) => {
    try {
        const answers = await Answer.find();

        res.status(200).json({
            success: true,
            message: "All answers are found",
            data: answers,
            count: answers.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all answers",
        });
        next();
    }
};

// get all answers of a question
module.exports.getAnswersOfQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;

    try {
        const answers = await Answer.find({ questionId: questionId });

        res.status(200).json({
            success: true,
            message: "All answers of the question are found",
            data: answers,
            count: answers.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all answers of the question",
        });
        next();
    }
};

// get all answers of a form from a user
module.exports.getAnswersOfFormOfUser = async (req, res, next) => {
    const formId = req.params.formId;
    const userId = req.params.userId;

    try {
        const answers = await Answer.find({ formId: formId, userId: userId });

        res.status(200).json({
            success: true,
            message: "All answers of the form from the user are found",
            data: answers,
            count: answers.length,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Cannot find all answers of the form from the user",
        });
        next();
    }
};