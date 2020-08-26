const mongoose = require("mongoose");

const TownSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: Array,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "states",
    required: true,
  },
});

const Town = mongoose.model("towns", TownSchema);
module.exports = Town;
