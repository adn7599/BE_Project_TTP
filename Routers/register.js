const express = require("express");
const crypto = require("crypto");

const auth = require("../Authentication/auth");
const otp = require("../Authentication/otp");
const conn = require("../Database");
const { table } = require("console");

const router = express.Router();

router.post("/accountVerify", (req, res, next) => {
  //Client sends role and reg_id
  //Server sends back number in encrypted form 98XXXXXX99
  if (req.body.role && req.body.reg_id) {
    let role = req.body.role;
    let reg_id = req.body.reg_id;

    let tableName;
    let colName = "Reg_no";

    switch (role) {
      case "customer":
        tableName = "GP_Customer";
        colName = "Ration_no";
        break;
      case "SP":
        tableName = "GP_Supplier";
        break;
      case "DA":
        tableName = "GP_Distributor";
        break;
      default:
        res
          .status(400)
          .json({ error: "Invalid Role Sent (valid roles: customer, SP, DA)" });
        break;
    }

    let query = "SELECT Mob_no FROM ?? WHERE ?? = ?;";
    let fquery = conn.format(query, [tableName, colName, reg_id]);
    console.log(fquery);
    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        //console.log(result);
        if (result.length == 0) {
          res.status(400);
          res.json({ error: "Invalid User" });
        } else {
          let phoneNum = result[0].Mob_no;
          phoneNum =
            phoneNum[0] + phoneNum[1] + "XXXXXX" + phoneNum[8] + phoneNum[9];
          res.send({
            status: "User Valid!",
            Mob_no: phoneNum,
          });
        }
      }
    });
  } else {
    res
      .status(400)
      .json({ error: "Invalid parameters sent! (role, reg_id required)" });
  }
});

router.post("/sendOTP", (req, res, next) => {
  //Client sends role and reg_id
  //Server sends OTP to the registered number and a token in response
  if (req.body.role && req.body.reg_id) {
    let role = req.body.role;
    let reg_id = req.body.reg_id;

    let tableName;
    let colName = "Reg_no";

    switch (role) {
      case "customer":
        tableName = "GP_Customer";
        colName = "Ration_no";
        break;
      case "SP":
        tableName = "GP_Supplier";
        break;
      case "DA":
        tableName = "GP_Distributor";
        break;
      default:
        res
          .status(400)
          .json({ error: "Invalid Role Sent (valid roles: customer, SP, DA)" });
        break;
    }

    let query = "SELECT Mob_no FROM ?? WHERE ?? = ?;";
    let fquery = conn.format(query, [tableName, colName, reg_id]);
    console.log(fquery);
    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        //console.log(result);
        if (result.length == 0) {
          res.status(400);
          res.json({ error: "Invalid User" });
        } else {
          let phoneNum = result[0].Mob_no;
          let token = otp.createNewOTP(phoneNum);
          res.json({ status: "OTP sent successfully!", token });
        }
      }
    });
  } else {
    res
      .status(400)
      .json({ error: "Invalid parameters sent! (role, reg_id required)" });
  }
});

router.post("/verifyOTP", (req, res, next) => {
  //Client sends role and reg_id and otp and token
  //Server verifies the otp and sends a registration token

  if (req.body.role && req.body.reg_id && req.body.otp && req.body.token) {
    let role = req.body.role;
    let reg_id = req.body.reg_id;
    let sentOtp = req.body.otp;
    let token = req.body.token;

    let tableName;
    let colName = "Reg_no";

    switch (role) {
      case "customer":
        tableName = "GP_Customer";
        colName = "Ration_no";
        break;
      case "SP":
        tableName = "GP_Supplier";
        break;
      case "DA":
        tableName = "GP_Distributor";
        break;
      default:
        res
          .status(400)
          .json({ error: "Invalid Role Sent (valid roles: customer, SP, DA)" });
        break;
    }

    let query = "SELECT Mob_no FROM ?? WHERE ?? = ?;";
    let fquery = conn.format(query, [tableName, colName, reg_id]);
    console.log(fquery);
    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        //console.log(result);
        if (result.length == 0) {
          res.status(400);
          res.json({ error: "Invalid User" });
        } else {
          let phoneNum = result[0].Mob_no;

          let success = otp.verifyOTP(phoneNum, token, sentOtp);

          if (success) {
            //Create a registration token unique for the user
            let regToken = otp.createRegToken(role, reg_id);

            res.json({ status: "OTP Verified!", token: regToken });
          } else {
            res.status(400);
            res.json({ error: "Invalid OTP" });
          }
        }
      }
    });
  } else {
    res.status(400).json({
      error: "Invalid parameters sent! (role, reg_id , otp, token required)",
    });
  }
});

router.post("/accountRegister", (req, res, next) => {
  if (req.body.role && req.body.reg_id && req.body.password && req.body.token) {
    let role = req.body.role;
    let reg_id = req.body.reg_id;
    let password = req.body.password;
    let token = req.body.token;

    let tableName;
    let colName = "Reg_no";

    switch (role) {
      case "customer":
        tableName = "GP_Customer";
        colName = "Ration_no";
        break;
      case "SP":
        tableName = "GP_Supplier";
        break;
      case "DA":
        tableName = "GP_Distributor";
        break;
      default:
        res
          .status(400)
          .json({ error: "Invalid Role Sent (valid roles: customer, SP, DA)" });
        break;
    }

    let query = "SELECT * FROM ?? WHERE ?? = ?;";
    let fquery = conn.format(query, [tableName, colName, reg_id]);
    console.log(fquery);
    conn.query(fquery, (err, result, field) => {
      if (err) {
        next(err);
      } else {
        //console.log(result);
        if (result.length == 0) {
          res.status(400);
          res.json({ error: "Invalid User" });
        } else {
          let user = result[0];

          let success = otp.verifyRegToken(role, reg_id, token);

          if (success) {
            //Create a registration token unique for the user

            if (password.length >= 8 && password.length <= 15) {
              let hashedPass = crypto
                .createHash("SHA256")
                .update(password)
                .digest("hex");

              let now = new Date();
              let aesKey = crypto.randomBytes(16).toString("hex"); //128 bits => 16 bytes

              let query = "INSERT INTO ?? VALUES(?,?,?,?)";
              let fquery = conn.format(query, [
                tableName.substring(3),
                reg_id,
                now,
                hashedPass,
                aesKey,
              ]);

              conn.query(fquery, (err, result, field) => {
                if (err) {
                  next(err);
                } else {
                  console.log(result);
                  res.json({ status: "User Registered!" });
                }
              });
            } else {
              res.status(400).json({
                error: "Password length should be between 8 and 15, included",
              });
            }
          } else {
            res.status(400);
            res.json({ error: "Invalid Token, Verify OTP Again" });
          }
        }
      }
    });
  } else {
    res.status(400).json({
      error:
        "Invalid parameters sent! (role, reg_id, password, token required)",
    });
  }
});

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
                  "status" : "User Logged In!",
                  "token": token,
                  "privateKey":"",
                  "RelayDBKey":usr.DB_Key, 
                })       
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
