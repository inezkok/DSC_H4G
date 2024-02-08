const router = require("express").Router();
const { createFeedbackResponse, createRegisterResponse, deleteResponse, updateResponse, getResponse, getAllResponses, getAllResponsesForFeedbackForm, getAllResponsesForRegisterForm } = require("../Controllers/ResponseController");

// create feedback response
router.route("/feedback-form/:feedbackFormId/:userId").post(createFeedbackResponse);

// create register response
router.route("/register-form/:regFormId/:userId").post(createRegisterResponse);

// delete response
router.delete("/:responseId", deleteResponse);

// update response
router.put("/:responseId", updateResponse);

// get response
router.get("/:responseId", getResponse);

// get all responses
router.get("/", getAllResponses);

// get all responses for feedback form
router.route("/feedback-form/:feedbackFormId").get(getAllResponsesForFeedbackForm);

// get all responses for register form
router.route("/register-form/:registerFormId").get(getAllResponsesForRegisterForm);

module.exports = router;