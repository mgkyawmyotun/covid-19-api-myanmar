const mongoose = require("mongoose");

const DistrictCaseSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Types.ObjectId,
      ref: "districts",
      required: true,
    },
    totalDeath: {
      type: Number,
      default: 0,
    },
    totalCase: {
      type: Number,
      default: 0,
      required: true,
    },
    recovered: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const CaseDistrict = mongoose.model("caseDistrict", DistrictCaseSchema);
module.exports = CaseDistrict;
