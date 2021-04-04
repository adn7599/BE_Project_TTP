const express = require("express");

const verifyRelay = require("../../Authentication/relayAuth");

const router = express.Router();

router.post("/", verifyRelay, (req, res, next) => {
  try {
    if (req.body.role && req.body.reg_id && req.body.hash && req.body.sign) {
      let role = req.body.role;
      let reg_id = req.body.reg_id;
      let hash = req.body.hash;
      let sign = req.body.sign;

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
          res.status(400).json({
            error: "Invalid Role, must be either customer or SP or DA",
          });
          break;
      }

      let query = "SELECT  FROM ?? WHERE ?? = ?";
      let fquery = conn.format(query, [tableName, colName, reg_id]);

      conn.query(fquery, (err, result, field) => {
        if (err) {
          next(err);
        } else {
          if (result.length == 0) {
            res
              .status(213) //custom status code
              .json({ error: "User not registered here or invalid" });
          } else {
            let relayPassword = result[0].Relay_Password;

            res.json({
              role,
              reg_id,
              relay_password: relayPassword,
            });
          }
        }
      });
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
