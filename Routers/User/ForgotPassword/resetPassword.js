const express = require("express");
const crypto = require("crypto");

const userModels = require("../../../Models/Users");
const forgotPassOtp = require("../../../Authentication/forgotPassOtp");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    if (
      req.body.role &&
      req.body.reg_id &&
      req.body.new_password &&
      req.body.token
    ) {
      const role = req.body.role;
      const reg_id = req.body.reg_id;

      const newPassword = req.body.new_password;
      const token = req.body.token;

      if (
        !(
          typeof role === "string" &&
          typeof reg_id === "string" &&
          typeof newPassword === "string" &&
          typeof token === "string"
        )
      ) {
        res.status(400).json({ error: "All fields must be strings" });
        return;
      }

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

      //fetching the userDoc

      const userDoc = await userModels[modelName].findById(reg_id);

      if (userDoc) {
        //Need to check if the token is valid

        const success = forgotPassOtp.verifyResetToken(role, reg_id, token);

        if (success) {
          //Token is valid so reseting the user's password
          //First need to convert to hash
          const hashedNewPassword = crypto
            .createHash("SHA256")
            .update(newPassword)
            .digest("hex");

          //saving the new password
          userDoc.password = hashedNewPassword;
          await userDoc.save();

          res.json({ status: "Password reset successfully" });
        } else {
          //Invalid token
          res.status(400).json({ error: "Invalid Token" });
        }
      } else {
        res.status(400).json({ error: "User invalid or not registered" });
      }
    } else {
      res.status(400).json({
        error: "Fields role, reg_id, new_password and token required",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
