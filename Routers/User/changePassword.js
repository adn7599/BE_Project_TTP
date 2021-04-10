const express = require("express");
const crypto = require("crypto");

const userModels = require("../../Models/Users");
const auth = require("../../Authentication/auth");

const router = express.Router();

router.post("/", auth.verifyUser, async (req, res, next) => {
  try {
    if (req.body.old_password && req.body.new_password) {
      const role = req.user.role;
      const reg_id = req.user.reg_id;

      const oldPassword = req.body.old_password;
      const newPassword = req.body.new_password;

      if (
        !(typeof oldPassword === "string" && typeof newPassword === "string")
      ) {
        //fields are not strings
        res.status(400).json({ error: "All fields must contain string" });
        return;
      }

      if (
        !(
          oldPassword.length >= 8 &&
          oldPassword.length <= 15 &&
          newPassword.length >= 8 &&
          newPassword.length <= 15
        )
      ) {
        //Invalid password length
        res.status(400).json({
          error: "Password length should be between 8 and 15, included",
        });
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
            error: "Invalid Token",
          });
          return;
      }

      //fetching the userDoc
      const userDoc = await userModels[modelName].findById(reg_id);

      if (userDoc) {
        //UserDoc found

        //checking if the oldpassword is correct
        //Prior requirement is to hash the sent password
        const hashedOldPassword = crypto
          .createHash("SHA256")
          .update(oldPassword)
          .digest("hex");

        if (userDoc.password === hashedOldPassword) {
          //Old password is correct
          //Updating the password

          //calculating hash of the new password
          const hashedNewPassword = crypto
            .createHash("SHA256")
            .update(newPassword)
            .digest("hex");

          //saving the new password
          userDoc.password = hashedNewPassword;
          await userDoc.save();

          res.json({ status: "Password updated successfully" });
        } else {
          res.status(400).json({ error: "Incorrect old password" });
        }
      } else {
        res.status(400).json({ error: "Invalid Token" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Fields old_password and new_password required!" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
