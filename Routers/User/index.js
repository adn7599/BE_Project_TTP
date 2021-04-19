const express = require("express");

const router = express.Router();

router.use("/register", require("./Register"));

router.use("/changePassword", require("./changePassword"));
router.use("/forgotPassword", require("./ForgotPassword"));

router.use("/login", require("./login"));
router.use("/details", require("./details"));
router.use("/sign", require("./sign"));
router.use("/verifySign", require("./verifySign"));

module.exports = router;
