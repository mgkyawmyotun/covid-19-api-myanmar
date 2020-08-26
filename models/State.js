const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const State = mongoose.model("states", StateSchema);
module.exports = State;
