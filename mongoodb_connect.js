const mongoose = require("mongoose");
module.exports = function init() {
  return mongoose.connect(process.env.MONGODB_URL);
};
