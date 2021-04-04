const express = require("express");

const router = express.Router();

router.use("/accountVerify", require("./accountVerify"));
router.use("/sendOTP", require("./sendOTP"));
router.use("/verifyOTP", require("./verifyOTP"));
router.use("/accountRegister", require("./accountRegister"));

module.exports = router;
