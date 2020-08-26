const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    min: 6,
    max: 10,
  },

  password: {
    type: String,
    min: 6,
    max: 100,
  },
  token: {},
});
UserSchema.methods.getResult = function () {
  const owner = this;
  return { username: owner.username, email: owner.email, token: owner.token };
};
UserSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  this.token = token(this);
});
const User = mongoose.model("admin", UserSchema);
module.exports = User;
