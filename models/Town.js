const mongoose = require("mongoose");

const TownSchema = new mongoose.Schema(
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
    location: {
      type: Array,
      default: [0, 0],
      required: true,
    },
  },
  { timestamps: true }
);

const Town = mongoose.model("towns", TownSchema);
module.exports = Town;
