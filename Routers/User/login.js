const express = require("express");
const crypto = require("crypto");

const userModels = require("../../Models/Users");
const auth = require("../../Authentication/auth");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    if (req.body.role && req.body.reg_id && req.body.password) {
      const role = req.body.role;
      const reg_id = req.body.reg_id;
      const password = req.body.password;

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
        //user present in the Collection
        //hashing password before comparison
        const hashedPass = crypto
          .createHash("SHA256")
          .update(password)
          .digest("hex");

        if (userDoc.password === hashedPass) {
          //password matched
          const token = await auth.getToken(role, reg_id, res, next);

          res.json({
            status: "User Logged In!",
            token: token,
            relay_password: userDoc.relayPassword,
          });
        } else {
          //wrong password
          res.status(400).json({ error: "Invalid Password" });
        }
      } else {
        //user not found
        res.status(400);
        res.json({ error: "Invalid User!" });
      }
    } else {
      res.status(400).json({
        error: "Fields role, reg_id, password required",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/check", auth.verifyUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
