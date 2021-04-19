const express = require("express");

const auth = require("../../Authentication/auth");
const userModels = require("../../Models/Users");
const router = express.Router();

router.get("", auth.verifyUser, async (req, res, next) => {
  try {
    const role = req.user.role;
    const reg_id = req.user.reg_id;

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
          error: "Invalid Token",
        });
        return;
    }

    const gpUserDoc = await userModels[modelName].findById(reg_id);

    if (gpUserDoc) {
      res.json(gpUserDoc);
    } else {
      res.status(400);
      res.json({ error: "Invalid Token" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
