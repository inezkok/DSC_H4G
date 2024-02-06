const { createActivity, deleteActivity, updateActivity, getActivity, getActivities } = require('../Controllers/ActivityController');
const router = require("express").Router();

// create activity
router.post('/', createActivity);

// delete activity
router.delete('/:id', deleteActivity);

// update activity
router.put('/:id', updateActivity);

// get activity
router.get('/:id', getActivity);

// get all activities
router.get('/', getActivities);

module.exports = router;