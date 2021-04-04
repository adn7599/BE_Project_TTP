const express = require("express");

const verifyRelay = require("../../Authentication/relayAuth");

const userModels = require("../../Models/Users");

const router = express.Router();

router.get("/:role/:reg_id", verifyRelay, async (req, res, next) => {
  try {
    if (req.params.role && req.params.reg_id) {
      const role = req.params.role;
      const reg_id = req.params.reg_id;

      let modelName;

      switch (role) {
        case "customer":
          modelName = "Customer";
          break;
        case "SP":
          modelName = "Supplier";
          break;
        case "DA":
          modelName = "Distributor";
          break;
        default:
          res.status(400).json({
            error: "Invalid Role Sent (valid roles: customer, SP, DA)",
          });
          return;
      }

      const userDoc = await userModels[modelName].findById(reg_id);

      if (userDoc) {
        //User found
        const relayPassword = userDoc.relayPassword;

        res.json({
          role,
          reg_id,
          relay_password: relayPassword,
        });
      } else {
        //User not registered or invalid
        res
          .status(213) //custom status code
          .json({ error: "User not registered here or invalid" });
      }
    } else {
      res
        .status(400)
        .json({ error: "URL Parameters role and reg_id required" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
