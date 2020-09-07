const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
      required: true,
    },
  },
  { timestamps: true }
);

const District = mongoose.model("districts", DistrictSchema);
module.exports = District;
