const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body, validationResult, param, Result } = require("express-validator");
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

exports.validateTown = () => {
  return [
    body("name").notEmpty().withMessage("Name Cannot be Empty"),
    body("location")
      .notEmpty()
      .withMessage("location Cannot Be Empty")
      .isArray()
      .withMessage("location must be array"),
    body("state_id")
      .notEmpty()
      .withMessage("State_id Cannot Be Empty")
      .isMongoId()
      .withMessage("state_id is not a valid Object id"),
  ];
};
exports.validateTownShip = () => {
  return [
    body("name").notEmpty().withMessage("Name Cannot be Empty"),
    body("town_id")
      .notEmpty()
      .withMessage("town_id Cannot Be Empty")
      .isMongoId()
      .withMessage("town_id is not a valid Object id"),
  ];
};
exports.validateHospital = () => {
  return [
    body("name").notEmpty().withMessage("Name Cannot be Empty"),
    body("town_id")
      .notEmpty()
      .withMessage("town_id Cannot Be Empty")
      .isMongoId()
      .withMessage("town_id is not a valid Object id"),
  ];
};
exports.validateState = () => {
  return [
    body("name").notEmpty().withMessage("Name Cannot be Empty"),
    body("location")
      .notEmpty()
      .withMessage("location Cannot Be Empty")
      .isArray()
      .withMessage("location must be array"),
  ];
};
exports.validatePatient = () => {
  return [
    body("patient_id").notEmpty().withMessage("Patient Id Cannot Be Empty"),

    body("age")
      .notEmpty()
      .withMessage("age cannot be empty")
      .isNumeric()
      .withMessage("age must be number"),
    body("gender").notEmpty().withMessage("gender cannot be empty"),
    body("state_id")
      .notEmpty()
      .withMessage("state_id cannot be empty")
      .isMongoId()
      .withMessage("state_id must be valid id"),
    body("hospital_id")
      .notEmpty()
      .withMessage("hospital_id cannot be empty")
      .isMongoId()
      .withMessage("hospital_id  must be valid id"),
    body("town_id")
      .notEmpty()
      .withMessage("town_id cannot be empty")
      .isMongoId()
      .withMessage("town_id must be valid id"),
    body("towns_ship_id")
      .notEmpty()
      .withMessage("towns_ship_id cannot be empty")
      .isMongoId()
      .withMessage("towns_ship_id must object id"),

    body("oversea_country")
      .notEmpty()
      .withMessage("oversea_country cannot be empty"),
    body("date")
      .notEmpty()
      .withMessage("date cannot be empty")
      .isDate()
      .withMessage("date must be date type"),
  ];
};
exports.deleteValidation = () => {
  return [
    param("id")
      .exists()
      .withMessage("/id need")
      .isMongoId()
      .withMessage("/id must be valid obj id"),
  ];
};
exports.getErrorMessage = (req) => {
  const errors = validationResult(req).array();
  return errors.map((error) => {
    return { [error.param]: error.msg };
  });
};
exports.isEqual = (password, hash_password) => {
  return bcrypt.compareSync(password, hash_password);
};
exports.removeNull = (object_value = {}) => {
  console.log(object_value);
  const new_obj = {};
  for (let [k, v] of object_value.entries()) {
    if (object_value[k]) new_obj[k] = v;
  }
  return new_obj;
};
