const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.hash = (password) => {
  return bcrypt.hashSync(password, 12);
};
exports.token = (user) => {
  return jwt.sign(
    { name: user.username, id: user._id },
    process.env.jwt_secrect,
    { expiresIn: "24h" }
  );
};
exports.isEqual = (password, hash_password) => {
  return bcrypt.compareSync(password, hash_password);
};

exports.getErrorLogin = (res) => {
  return res.status(401).json([
    {
      email: "Invalid Email Or Password",
    },
  ]);
};
exports.loginValidation = () => {
  return [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email Cannot Be Empty")
      .isEmail()
      .withMessage("Enter a valid Email")
      .normalizeEmail({ all_lowercase: true }),
    body("password")
      .isLength({ min: 6, max: 200 })
      .withMessage("Password Must Be At Least 6")
      .trim(),
  ];
};
exports.registerValidation = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username Cannot Be Empty"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email Cannot Be Empty")
      .isEmail()
      .withMessage("Enter a valid Email")
      .normalizeEmail({ all_lowercase: true }),
    body("password")
      .isLength({ min: 6, max: 200 })
      .withMessage("Password Must Be At Least 6")
      .trim(),
  ];
};
exports.getErrorMessage = (req) => {
  const errors = validationResult(req).array();
  return errors.map((error) => {
    return { [error.param]: error.msg };
  });
};
