const express = require("express");
const conn = require("../Database");
const router = express.Router();

router.get("/userCredentials/:role/:reg_id", (req, res,next) => {
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
        res
          .status(400)
          .json({ error: "Invalid Role, must be either customer or SP or DA" });
        break;
    }

    let query = "SELECT Relay_Password FROM ?? WHERE ?? = ?";
    let fquery = conn.format(query, [tableName, colName, reg_id]);

    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        if (result.length == 0) {
            res.status(404).json({ error : "Invalid User"});
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
    res.status(400).json({ error: "URL Parameters role and reg_id required" });
  }
});

module.exports = router;
