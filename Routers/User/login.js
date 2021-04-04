const express = require("express");

const auth = require("../../Authentication/auth");

const router = express.Router();

router.post("/", (req, res, next) => {
  if (req.body.role && req.body.reg_id && req.body.password) {
    let role = req.body.role;
    let reg_id = req.body.reg_id;
    let password = req.body.password;

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
          .json({ error: "Invalid Role Sent (valid roles: customer, SP, DA)" });
        break;
    }

    let query = "SELECT * FROM ?? WHERE ?? = ?";
    let fquery = conn.format(query, [tableName, colName, reg_id]);

    conn.query(fquery, (err, result, fields) => {
      if (err) {
        next(err);
      } else {
        if (result.length == 0) {
          res.status(400);
          res.json({ error: "Invalid User!" });
        } else {
          let usr = result[0];

          let hashedPass = crypto
            .createHash("SHA256")
            .update(password)
            .digest("hex");

          if (usr.Password === hashedPass) {
            auth
              .getToken(role, reg_id, res, next)
              .then((token) => {
                res.json({
                  status: "User Logged In!",
                  token: token,
                  relay_password: usr.Relay_Password,
                });
              })
              .catch((err) => {
                next(err);
              });
          } else {
            res.status(400).json({ error: "Invalid Password" });
          }
        }
      }
    });
  } else {
    res.status(400).json({
      error: "Invalid parameters sent! (role, reg_id, password required)",
    });
  }
});

router.post("/check", auth.verifyUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
