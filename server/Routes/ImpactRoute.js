const router = require("express").Router();
const { createImpact, deleteImpact, updateImpact, getImpact, getAllImpacts } = require("../Controllers/ImpactController");

// create impact
router.post("/", createImpact);

// delete impact
router.delete("/:id", deleteImpact);

// update impact
router.put("/:id", updateImpact);

// get impact
router.get("/:id", getImpact);

// get all impacts
router.get("/", getAllImpacts);

module.exports = router;