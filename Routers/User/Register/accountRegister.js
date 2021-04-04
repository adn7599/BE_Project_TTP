const express = require("express");
const crypto = require("crypto");

const userModels = require("../../../Models/Users");

const otp = require("../../../Authentication/otp");
const myCrypto = require("../../../Cryptography");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    if (
      req.body.role &&
      req.body.reg_id &&
      req.body.password &&
      req.body.token
    ) {
      const role = req.body.role;
      const reg_id = req.body.reg_id;
      const password = req.body.password;
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

      const userDoc = await userModels[modelName.substring(2)].findById(reg_id);
      //checking if the user is already registered?
      if (userDoc) {
        //user already registered
        res.status(400);
        res.json({ error: "User Already registered!" });
        return;
      } else {
        //User not registered
        //Getting gpUser

        const gpUserDoc = await userModels[modelName].findById(reg_id);
        if (gpUserDoc) {
          let success = otp.verifyRegToken(role, reg_id, token);

          if (success) {
            //registration token is valid
            //checking password format
            if (password.length >= 8 && password.length <= 15) {
              //Fields
              //Regno, reg_datetime, password, pub_key, pri_key,relay_pass

              const now = new Date();
              const hashedPass = crypto
                .createHash("SHA256")
                .update(password)
                .digest("hex");

              const keys = await myCrypto.generateKeyPair();

              const publicKey = keys.publicKey;
              const encPrivateKey = keys.encPrivateKey;
              const relayPassword = myCrypto.generateRelayPassword();

              //creating the new user
              const newUser = new userModels[modelName.substring(2)]({
                _id: reg_id,
                regDateTime: now,
                password: hashedPass,
                publicKey: publicKey,
                privateKey: encPrivateKey,
                relayPassword: relayPassword,
              });

              await newUser.save();

              res.json({
                msg: "User registered Successfully",
              });
            } else {
              //Invalid password format
              res.status(400).json({
                error: "Password length should be between 8 and 15, included",
              });
            }
          } else {
            //Invalid Registration Token
            res.status(400);
            res.json({ error: "Invalid Token, Verify OTP Again" });
          }
        } else {
          //Invalid user
          res.status(400);
          res.json({ error: "Invalid User" });
        }
      }
    } else {
      //Invalid Fields
      res.status(400).json({
        error: "Invalid Fields sent! (role, reg_id, password, token required)",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
