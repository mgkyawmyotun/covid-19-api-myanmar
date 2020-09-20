const Router = require("express").Router();
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const { sendForgetToken, sendMessage } = require("../../mail");
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
        .json([{ error: "User with this email already exit" }]);
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

Router.post("/user/forget", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "User not exists with that email" });
  }
  user.forget_token = uuidv4();
  user.token_date = Date.now();
  await user.save();
  sendForgetToken(user.forget_token, user.email);
  return res.status(200).json({ message: "Token Send Completed Check Email" });
});
Router.post("/user/new", async (req, res, next) => {
  const { token, new_password } = req.body;
  if (!token) return res.status(400).json({ error: "Token cannot be empty" });
  if (!new_password)
    return res.status(400).json({ error: "new_password cannot be empty" });
  const user = await User.findOne({ forget_token: token });
  if (!user) return res.status(400).json({ error: "Wrong Token" });
  if (new_password.length < 6)
    return res.status(400).json({ error: "Password Must Be 6 Character Long" });

  if (new Date() - new Date(user.token_date) > 120000)
    return res
      .status(400)
      .json({ error: "Token Expires Please Rerequest Token" });
  user.password = new_password;
  user.token = undefined;
  user.forget_token = undefined;
  user.token_date = undefined;
  await user.save();
  return res.json({ message: "Password Changed Completed" });
});
Router.post("/send/message", (req, res, next) => {
  const { username, message } = req.body;
  if (!username)
    return res.status(400).json({ error: "Username Cannot Be Empty" });
  if (!message)
    return res.status(400).json({ error: "Message Cannot Be Empty" });
  try {
    sendMessage(username, message);
    return res.status(200).json({ message: "Send Message To Admin Complete" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = Router;
