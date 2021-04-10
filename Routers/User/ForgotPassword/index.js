const express = require("express");

const router = express.Router();

router.use("/sendOTP", require("./sendOTP"));
router.use("/verifyOTP", require("./verifyOTP"));
router.use("/resetPassword", require("./resetPassword"));

module.exports = router;
