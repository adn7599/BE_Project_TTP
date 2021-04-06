const express = require("express");

const verifyRelay = require("../../Authentication/relayAuth");

const userModels = require("../../Models/Users");
const myCrypto = require("../../Cryptography");

const router = express.Router();

router.post("/", verifyRelay, async (req, res, next) => {
  try {
    if (req.body.role && req.body.reg_id && req.body.hash && req.body.sign) {
      const role = req.body.role;
      const reg_id = req.body.reg_id;
      const hash = req.body.hash;
      const sign = req.body.sign;

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
        //User found
        const publicKey = userDoc.publicKey;
        const isVerified = myCrypto.verifyMessage(hash, sign, publicKey);

        res.json({ isVerified });
      } else {
        //User not registered or invalid
        res
          .status(213) //custom status code
          .json({ error: "User not registered here or invalid" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Fields role,reg_id,hash and sign required" });
    }
  } catch (err) {
    if (err.message === "Signature without r or s") {
      res.status(213).json({ error: "Invalid signature format" });
    } else {
      next(err);
    }
  }
});

module.exports = router;
