const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  registerForEvent,
  cancelRegistration,
  getUserEvents
} = require("../controllers/registrationController");

router.post("/register", protect, registerForEvent);
router.delete("/cancel/:eventId", protect, cancelRegistration);
router.get("/my-registrations", protect, getUserEvents);


module.exports = router;
