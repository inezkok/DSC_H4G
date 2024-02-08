const router = require("express").Router();
const { createRegisterForm, deleteRegisterForm, updateRegisterForm, getRegisterForm, getAllRegisterForms } = require("../Controllers/RegisterFormController");

// create register form
router.post("/:activityId", createRegisterForm);

// delete register form
router.delete("/:regFormId", deleteRegisterForm);

// update register form
router.put("/:regFormId", updateRegisterForm);

// get register form
router.get("/:regFormId", getRegisterForm);

// get all register forms
router.get("/", getAllRegisterForms);

module.exports = router;