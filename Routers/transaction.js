const express = require("express");

const auth = require("../Authentication/auth");
const conn = require("../Database");

const router = express.Router();

router.post("/request", (req, res, next) => {
  let requestID = "Random UUID";
  let time = Date.now();
  let requester = req.body.requester_regNo;
  let provider = req.body.provider_regNo;
  let order = req.body.order;
  let digitalSignature_requester =
    "digital signature //ENCreqPR((Hash(message))";

  res.json({
    request_id: requestID,
    transaction_request: "WORKING",
    time: time,
  });

  next();
});

router.post("/confirm", (req, res, next) => {
  let confirmToken = "Confirm Token";
  let paymentToken = req.body.payment_token;
  let paymentID = req.body.payment_id;
  let paymentTime = req.body.payment_time;
  let confirmTime = Date.now();

  res.json({
    transaction_status: "Confirmed",
    confirm_time: confirmTime,
  });
});

module.exports = router;
