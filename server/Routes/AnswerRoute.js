const router = require("express").Router();
const { createAnswer, deleteAnswer, updateAnswer, getAnswer, getAnswers, getAnswersOfQuestion, getAnswersOfFormOfUser } = require("../Controllers/AnswerController");

// create answer
router.post("/:formId/:questionId/:userId", createAnswer);

// delete answer
router.delete("/:questionId/:id", deleteAnswer);

// update answer
router.put("/:id", updateAnswer);

// get answer
router.get("/:id", getAnswer);

// get all answers
router.get("/", getAnswers);

// get all answers of question
router.get("/:formId/:questionId", getAnswersOfQuestion);

// get all answers of form of user
router.get("/:formId/:questionId/:userId", getAnswersOfFormOfUser);

module.exports = router;