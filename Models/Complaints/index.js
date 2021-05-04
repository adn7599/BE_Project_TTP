const mongoose = require("mongoose");

function getCompaintSchema(complianerRef, complaineeRef) {
  const ComplaintSchema = mongoose.Schema({
    complainer: {
      type: String,
      ref: complianerRef,
      required: true,
    },
    complainee: {
      type: String,
      ref: complaineeRef,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    time: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  });

  return ComplaintSchema;
}

module.exports = {
  CustSuppComplaintModel: mongoose.model(
    "Cust_Suppl_Complaints",
    getCompaintSchema("GP_Customer", "GP_Supplier")
  ),
  SuppDistComplaintModel: mongoose.model(
    "Suppl_Dist_Complaints",
    getCompaintSchema("GP_Supplier", "GP_Distributor")
  ),
};
