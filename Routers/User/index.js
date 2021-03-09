const express = require("express");
const crypto = require("crypto");
const auth = require("../../Authentication/auth");
const myCrypto = require("../../Cryptography");
const conn = require("../../Database");

const register = require("./register");

const router = express.Router();

router.use("/register", register);

router.post("/login", (req, res, next) => {
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

router.post("/sign", auth.verifyUser, (req, res, next) => {
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

router.post("/verifySign", auth.verifyUser, (req, res, next) => {
  if (req.body.hash && req.body.sign) {
    let hash = req.body.hash;
    let sign = req.body.sign;

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

    let query = "SELECT Public_Key FROM ?? WHERE ?? = ?";
    let fquery = conn.format(query, [tableName, colName, reg_id]);

    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        if (result.length == 0) {
          res.status(403).json({ error: "Invalid Token" });
        } else {
          let publicKey = result[0].Public_Key;

          let isVerified = myCrypto.verifyMessage(hash,sign,publicKey);

          res.json({isVerified});
        }
      }
    });
  } else {
    res.status(400).json({ error: "Parameter hash not found!" });
  }
});

module.exports = router;
