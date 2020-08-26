const mongoose = require("mongoose");

const TownShipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const TowmShip = mongoose.model("townships", TownShipSchema);
module.exports = TowmShip;
