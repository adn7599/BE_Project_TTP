const express = require("express");

const router = express.Router();

router.use("/userCredentials", require("./userCredentials"));
router.use("/verifySign", require("./verifySign"));

module.exports = router;
