const express = require("express");

const auth = require("../../Authentication/auth");

const router = express.Router();

router.post("/", auth.verifyUser, (req, res, next) => {
  if (req.body.hash) {
    let hash = req.body.hash;

    let reg_id = req.user.reg_id;
    let role = req.user.role;

    let tableName;
    let colName = "Reg_no";

    switch (role) {
      case "customer":
        tableName = "Customer";
        colName = "Ration_no";
        break;
      case "SP":
        tableName = "Supplier";
        break;
      case "DA":
        tableName = "Distributor";
        break;
      default:
        res.status(403).json({ error: "Invalid Token!" });
        break;
    }

    let query = "SELECT Private_Key FROM ?? WHERE ?? = ?";
    let fquery = conn.format(query, [tableName, colName, reg_id]);

    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        if (result.length == 0) {
          res.status(403).json({ error: "Invalid Token" });
        } else {
          let encPrivateKey = result[0].Private_Key;

          myCrypto
            .signMessage(hash, encPrivateKey)
            .then((sign) => {
              res.json({ hash, sign });
            })
            .catch((err) => next(err));
        }
      }
    });
  } else {
    res.status(400).json({ error: "Parameter hash not found!" });
  }
});

module.exports = router;
