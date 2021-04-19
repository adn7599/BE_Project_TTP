const express = require("express");

const userModels = require("../../../Models/Users");

const router = express.Router();

router.post("/", async (req, res, next) => {
  //Client sends role and reg_id
  //Server sends back number in encrypted form 98XXXXXX99
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
      let isRegistered = false;
      if (userDoc) {
        isRegistered = true;
      }

      const gpUserDoc = await userModels[modelName].findById(reg_id);
      if (gpUserDoc) {
        let phoneNum = gpUserDoc.mobNo;
        phoneNum =
          phoneNum[0] + phoneNum[1] + "XXXXXX" + phoneNum[8] + phoneNum[9];
        res.send({
          status: "User Valid!",
          Mob_no: phoneNum,
          isRegistered,
        });
      } else {
        res.status(400);
        res.json({ error: "Invalid User" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Invalid parameters sent! (role, reg_id required)" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
