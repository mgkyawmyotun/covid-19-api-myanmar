const mongoose = require("mongoose");

const CaseStateSchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Types.ObjectId,
      ref: "states",
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
  },
  { timestamps: true }
);

const CaseState = mongoose.model("caseState", CaseStateSchema);
module.exports = CaseState;
