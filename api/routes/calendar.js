const express = require("express");
const calendar = require("../controllers/calendar");
const passport = require('passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.get("/calendar", passportJWT, calendar.getAll);
router.post(
  "/calendar/:teamId",
  passportJWT,
  calendar.addMeeting
);
router.delete(
  "/calendar/:calId",
  passportJWT,
  calendar.cancel
);

module.exports = router;
