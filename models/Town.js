const mongoose = require("mongoose");

const TownSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Town = mongoose.model("towns", TownSchema);
module.exports = Town;
