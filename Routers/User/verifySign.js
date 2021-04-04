const express = require("express");

const auth = require("../../Authentication/auth");

const myCrypto = require("../../Cryptography");
const userModels = require("../../Models/Users");

const router = express.Router();

router.post("/", auth.verifyUser, async (req, res, next) => {
  try {
    if (req.body.hash && req.body.sign) {
      const hash = req.body.hash;
      const sign = req.body.sign;

      const reg_id = req.user.reg_id;
      const role = req.user.role;

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

      const userDoc = await userModels[modelName].findById(reg_id);

      if (userDoc) {
        const publicKey = userDoc.publicKey;
        const isVerified = myCrypto.verifyMessage(hash, sign, publicKey);

        res.json({ isVerified });
      } else {
        res.status(403).json({ error: "Invalid Token" });
      }
    } else {
      res.status(400).json({ error: "Fields hash and sign required" });
    }
  } catch (err) {
    if (err.message === "Signature without r or s") {
      res.status(213).json({ error: "Invalid signature" });
    } else {
      next(err);
    }
  }
});

module.exports = router;
