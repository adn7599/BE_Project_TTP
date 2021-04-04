const express = require("express");

const userModels = require("../../Models/Users");

const auth = require("../../Authentication/auth");
const myCrypto = require("../../Cryptography");

const router = express.Router();

router.post("/", auth.verifyUser, async (req, res, next) => {
  try {
    if (req.body.hash) {
      const hash = req.body.hash;

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
        //User is valid
        const encPrivateKey = userDoc.privateKey;
        const sign = await myCrypto.signMessage(hash, encPrivateKey);
        res.json({ hash, sign });
      } else {
        //User is invalid
        res.status(403).json({ error: "Invalid Token" });
      }
    } else {
      //Field hash not found
      res.status(400).json({ error: "Field hash required" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
