const router = require("express").Router();
const { createUser, deleteUser, updateUser, getUser, getUsers, getVolunteers, getAdmins} = require("../Controllers/UserController");

// create user
router.post("/", createUser);

// delete user
router.delete("/:id", deleteUser);

// update user
router.put("/:id", updateUser);

// get user
router.get("/:id", getUser);

// get all users
router.get("/", getUsers);

// get all patrons
router.get("/find/volunteer", getVolunteers);

// get all admins
router.get("/find/admin", getAdmins);

module.exports = router;