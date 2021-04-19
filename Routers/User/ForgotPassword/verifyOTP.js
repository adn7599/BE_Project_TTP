const express = require("express");

const userModels = require("../../../Models/Users");

const forgotPassOtp = require("../../../Authentication/forgotPassOtp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  //Client sends role and reg_id and otp and token
  //Server verifies the otp and sends a registration token
  try {
    if (req.body.role && req.body.reg_id && req.body.otp && req.body.token) {
      const role = req.body.role;
      const reg_id = req.body.reg_id;
      const sentOtp = req.body.otp;
      const token = req.body.token;

      let modelName;

      switch (role) {
        case "customer":
          modelName = "GpCustomer";
          break;
        case "SP":
          modelName = "GpSupplier";
          break;
        case "DA":
          modelName = "GpDistributor";
          break;
        default:
          res.status(400).json({
            error: "Invalid Role Sent (valid roles: customer, SP, DA)",
          });
          return;
      }

      const gpUserDoc = await userModels[modelName].findById(reg_id);

      //checking if the user has registered
      const userDoc = await userModels[modelName.substring(2)].findById(reg_id);
      if (userDoc == null) {
        res.status(400).json({ error: "User invalid or not registered" });
        return;
      }

      if (gpUserDoc) {
        let phoneNum = gpUserDoc.mobNo;

        let success = forgotPassOtp.verifyOTP(phoneNum, token, sentOtp);

        if (success) {
          //Create a registration token unique for the user
          let resetToken = forgotPassOtp.createResetToken(role, reg_id);

          res.json({ status: "OTP Verified!", token: resetToken });
        } else {
          res.status(400);
          res.json({ error: "Invalid OTP" });
        }
      } else {
        res.status(400);
        res.json({ error: "Invalid User" });
      }
    } else {
      res.status(400).json({
        error: "Invalid parameters sent! (role, reg_id , otp, token required)",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
