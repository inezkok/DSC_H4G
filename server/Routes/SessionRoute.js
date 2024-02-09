const router = require("express").Router();
const { createSession, deleteSession, updateSession, getSession, getAllSessions, getAllSessionsByActivity, getAllSessionsByVolunteer } = require('../Controllers/SessionController');

// create session
router.post('/:activityId', createSession);

// delete session
router.delete('/:id', deleteSession);

// update session
router.put('/:id', updateSession);

// get session
router.get('/:id', getSession);

// get all sessions
router.get('/', getAllSessions);

// get all sessions by activity
router.route('/activity/:activityId').get(getAllSessionsByActivity);

// get all sessions by volunteer
router.route('/volunteer/:volunteerId').get(getAllSessionsByVolunteer);

module.exports = router;