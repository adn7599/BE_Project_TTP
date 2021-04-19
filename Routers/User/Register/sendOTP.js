const express = require("express");

const userModels = require("../../../Models/Users");

const otp = require("../../../Authentication/otp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  //Client sends role and reg_id
  //Server sends OTP to the registered number and a token in response
  try {
    if (req.body.role && req.body.reg_id) {
      let role = req.body.role;
      let reg_id = req.body.reg_id;

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
      //checking if the user has already registered
      const userDoc = await userModels[modelName.substring(2)].findById(reg_id);
      if (userDoc) {
        res.status(400).json({ error: "User already registered" });
        return;
      }

      const gpUserDoc = await userModels[modelName].findById(reg_id);

      if (gpUserDoc) {
        let phoneNum = gpUserDoc.mobNo;
        let token = otp.createNewOTP(phoneNum);
        res.json({ status: "OTP sent successfully!", token });
      } else {
        res.status(400);
        res.json({ error: "Invalid User" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Invalid parameters sent! (role, reg_id required)" });
    }
  } catch {
    next(err);
  }
});

module.exports = router;
