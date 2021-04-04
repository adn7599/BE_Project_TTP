const express = require("express");

const verifyRelay = require('../../Authentication/relayAuth')

const router = express.Router();

router.get("/:role/:reg_id", verifyRelay, (req, res, next) => {
  try {
    if (req.params.role && req.params.reg_id) {
      let role = req.params.role;
      let reg_id = req.params.reg_id;

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

      let query = "SELECT Relay_Password FROM ?? WHERE ?? = ?";
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
