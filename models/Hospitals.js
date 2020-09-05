const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    town: {
      type: Schema.Types.ObjectId,
      ref: "towns",
      required: true,
    },
  },
  { timestamps: true }
);

const Hospital = mongoose.model("hospitals", HospitalSchema);
module.exports = Hospital;
