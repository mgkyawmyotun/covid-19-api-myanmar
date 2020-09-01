const Router = require("express").Router();
const User = require("../../models/User");
const { isAuth } = require("../../auth");
const {
  loginValidation,
  registerValidation,
  getErrorMessage,
  isEqual,
  getErrorLogin,
  editUserValidation,
} = require("../../util/utils");
Router.get("/user/all", isAuth, async (req, res, next) => {
  try {
    const user = await User.find({}).select("-_id username email");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
Router.post("/user/login", [loginValidation()], async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return getErrorLogin(res);
    if (!isEqual(password, user.password)) return getErrorLogin(res);
    await user.save();
    res.status(200).json(user.getResult());
  } catch (error) {
    next(error);
  }
});
Router.post(
  "/user/register",
  isAuth,
  [registerValidation()],
  async (req, res, next) => {
    const errors = getErrorMessage(req);

    if (errors.length > 0) {
      return res.status(404).json(errors);
    }
    const { username, email, password } = req.body;

    if (await User.findOne({ email: email }))
      return res
        .status(404)
        .json([{ email: "User with this email already exit" }]);
    try {
      const user = new User({ username, email, password });
      await user.save();
      return res.status(200).json(user.getResult());
    } catch (error) {
      next(error);
    }
  }
);
Router.get("/user", isAuth, (req, res, next) => {
  const user = Object.assign({}, req.user._doc);

  delete user.password;
  delete user.token;
  res.json(user);
});
Router.get("/user/logout", isAuth, async (req, res, next) => {
  const user = req.user;

  try {
    user.token = undefined;
    await user.save();
    return res.json({ message: "Logout Complete" });
  } catch (error) {
    next(error);
  }
});

Router.put("/user", isAuth, editUserValidation(), async (req, res, next) => {
  const user = req.user;
  const { username, email } = req.body;
  const errors = getErrorMessage(req);

  if (errors.length > 0) {
    return res.status(404).json({ error: "Email Must be valid" });
  }
  if (user.email !== email) {
    const us = await User.findOne({ email: email });
    if (us) return res.status(400).json({ error: "Email Already Exists" });
  }

  try {
    await User.updateOne({ _id: user._id }, { username, email });
    return res.status(200).json({ message: "edit complete" });
  } catch (error) {
    next(error);
  }
});
Router.put("/user/change", isAuth, async (req, res, next) => {
  const user = req.user;
  const { old_password, new_password, confirm_password } = req.body;
  if (!old_password)
    return res.status(400).json({ error: "Please provide old password" });
  if (!new_password)
    return res.status(400).json({ error: "Please provide new password" });

  if (new_password.length < 6)
    return res.status(400).json({ error: "Password Must Be 6 Character Long" });
  if (!(new_password == confirm_password))
    return res
      .status(404)
      .json({ error: "Password Must Be same new and confirm" });

  try {
    const user_old_password = user.password;
    if (!isEqual(old_password, user_old_password))
      return res.status(404).json({ error: "Old Password incorect" });
    user.password = new_password;
    user.token = undefined;
    await user.save();
    return res.json({ message: "Password Changed Completed" });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = Router;
