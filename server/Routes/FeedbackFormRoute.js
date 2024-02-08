const router = require("express").Router();
const { createFeedbackForm, deleteFeedbackForm, updateFeedbackForm, getFeedbackForm, getAllFeedbackForms } = require("../Controllers/FeedbackFormController");

// create feedback form
router.post("/:activityId", createFeedbackForm);

// delete feedback form
router.delete("/:feedbackFormId", deleteFeedbackForm);

// update feedback form
router.put("/:feedbackFormId", updateFeedbackForm);

// get feedback form
router.get("/:feedbackFormId", getFeedbackForm);

// get all feedback forms
router.get("/", getAllFeedbackForms);

module.exports = router;