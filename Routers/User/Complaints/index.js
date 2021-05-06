const express = require("express");
const auth = require("../../../Authentication/auth");
const mongoose = require("mongoose");

const {
  CustSuppComplaintModel,
  SuppDistComplaintModel,
} = require("../../../Models/Complaints");

const { GpSupplier, GpDistributor } = require("../../../Models/Users");

const router = express.Router();

router.use(auth.verifyUser);

router.post("/", async (req, res, next) => {
  try {
    if (
      req.body.complainee &&
      req.body.transaction_id &&
      req.body.subject &&
      req.body.body
    ) {
      //Need to check if the Provider exists
      if (req.user.role === "customer") {
        //checking if the supplier exists

        const suppl = await GpSupplier.findById(req.body.complainee);

        if (suppl) {
          //Valid supplier
          //Need to save the complaint
          const myComplaint = new CustSuppComplaintModel({
            complainee: req.body.complainee,
            complainer: req.user.reg_id,
            transaction_id: req.body.transaction_id,
            time: new Date(),
            subject: req.body.subject,
            body: req.body.body,
          });

          //saving the complaint
          const savedComplaint = await myComplaint.save();

          res.json(savedComplaint);
        } else {
          res.status(400).json({ error: "Invalid supplier" });
        }
      } else if (req.user.role === "SP") {
        //checking if the supplier exists

        const dist = await GpDistributor.findById(req.body.complainee);

        if (dist) {
          //Valid Distributor
          //Need to save the complaint
          const myComplaint = new SuppDistComplaintModel({
            complainee: req.body.complainee,
            complainer: req.user.reg_id,
            transaction_id: req.body.transaction_id,
            time: new Date(),
            subject: req.body.subject,
            body: req.body.body,
          });

          //saving the complaint
          const savedComplaint = await myComplaint.save();

          res.json(savedComplaint);
        } else {
          res.status(400).json({ error: "Invalid Distributor" });
        }
      } else {
        res.status(400).json({ error: "Invalid role" });
      }
    } else {
      res.status(400).json({
        error: "Required fields complainee, transaction_id, subject and body",
      });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: "Validation Error", message: err.errors });
    } else {
      next(err);
    }
  }
});

router.get("/", async (req, res, next) => {
  try {
    if (req.user.role === "customer") {
      const myComplaints = await CustSuppComplaintModel.find({
        complainer: req.user.reg_id,
      }).sort({ time: -1 });

      //Populating complainee
      for (let complaint of myComplaints) {
        await complaint
          .populate("complainee", "name address mobNo email")
          .execPopulate();
      }
      
      res.json(myComplaints);
    } else if (req.user.role === "SP") {
      const myComplaints = await SuppDistComplaintModel.find({
        complainer: req.user.reg_id,
      }).sort({ time: -1 });

      //Populating complainee
      for (let complaint of myComplaints) {
        await complaint
          .populate("complainee", "name address mobNo email")
          .execPopulate();
      }

      res.json(myComplaints);
    } else {
      res.status(400).json({ error: "Invalid role" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
