const router = require("express").Router();

router.get("/all", (req, res, next) => {
  res.json({ hellow: "hello" });
});

router.get("/state", (req, res, next) => {});
router.get("/town", (req, res, next) => {});
router.get("/township", (req, res, next) => {});
router.get("/hospital", (req, res, next) => {});

router.post("/add/patients", (req, res, next) => {});
router.post("/add/state", (req, res, next) => {});
router.post("/add/town", (req, res, next) => {});
router.post("/add/township", (req, res, next) => {});
router.post("/add/hospital", (req, res, next) => {});

router.delete("/delete/patients", (req, res, next) => {});
router.delete("/delete/state", (req, res, next) => {});
router.delete("/delete/town", (req, res, next) => {});
router.delete("/delete/township", (req, res, next) => {});
router.delete("/delete/hospital", (req, res, next) => {});

router.put("/edit/patients", (req, res, next) => {});
router.put("/edit/state", (req, res, next) => {});
router.put("/edit/town", (req, res, next) => {});
router.put("/edit/township", (req, res, next) => {});
router.put("/edit/hospital", (req, res, next) => {});

module.exports = router;
