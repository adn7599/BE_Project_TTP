const express = require("express");
const router = express.Router();

const config = require("../../configuration.json");

router.use("/userCredentials", require("./userCredentials"));
router.use("/verifySign", require("./verifySign"));

module.exports = router;
