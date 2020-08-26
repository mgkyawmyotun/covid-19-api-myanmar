const User = require("./models/User");

async function isAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Please Include token",
    });
  }
  const token = authorization.split("Bearer ")[1];

  const user = await User.findOne({ token: token });
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized User",
  });
}

module.exports = {
  isAuth,
};
