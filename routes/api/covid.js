const router = require("express").Router();

router.get("/all", (req, res, next) => {
  res.json({ hellow: "hello" });
});

router.post("/add", (req, res, next) => {});
module.exports = router;
