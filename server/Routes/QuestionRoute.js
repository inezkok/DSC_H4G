const router = require("express").Router();
const { createQuestion, deleteQuestion, updateQuestion, getQuestion, getQuestions, getQuestionsOfForm } = require("../Controllers/QuestionController");

// create question
router.post("/:formId", createQuestion);

// delete question
router.delete("/:formId/:id", deleteQuestion);

// update question
router.put("/:formId/:id", updateQuestion);

// get question
router.get("/:formId/:id", getQuestion);

// get questions of form
router.get("/:formId", getQuestionsOfForm);

// get all questions
router.get("/", getQuestions);

module.exports = router;