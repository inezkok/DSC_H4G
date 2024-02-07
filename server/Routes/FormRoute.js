const router = require("express").Router();
const { createForm, deleteForm, updateForm, getForm, getForms } = require("../Controllers/FormController");

// create form
router.post("/", createForm);

// delete form
router.delete("/:id", deleteForm);

// update form
router.put("/:id", updateForm);

// get form
router.get("/:id", getForm);

// get all forms
router.get("/", getForms);

module.exports = router;