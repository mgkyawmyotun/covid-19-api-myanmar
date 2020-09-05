const mongoose = require("mongoose");

const TownShipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    town: {
      type: mongoose.Types.ObjectId,
      ref: "towns",
      required: true,
    },
  },
  { timestamps: true }
);

const TowmShip = mongoose.model("townships", TownShipSchema);
module.exports = TowmShip;
