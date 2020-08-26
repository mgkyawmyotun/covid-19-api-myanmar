const router = require("express").Router();
const Covid = require("../../models/Covid");
const State = require("../../models/State");
const Town = require("../../models/Town");
const TownShip = require("../../models/TownShip");
const Hospitals = require("../../models/Hospitals");
router.get("/all", async (req, res, next) => {
  const patients = await Covid.find({});
  res.json(patients);
});

router.get("/states", async (req, res, next) => {
  const states = await State.find({});
  res.json(states);
});
router.get("/towns", async (req, res, next) => {
  const towns = await Town.find({});
  res.json(towns);
});
router.get("/townships", async (req, res, next) => {
  const townsships = await TownShip.find({});
  res.json(townsships);
});
router.get("/hospitals", async (req, res, next) => {
  const hospitals = await Hospitals.find({});
  res.json(hospitals);
});

router.post("/add/patients", async (req, res, next) => {});
router.post("/add/state", async (req, res, next) => {});
router.post("/add/town", async (req, res, next) => {});
router.post("/add/township", async (req, res, next) => {});
router.post("/add/hospital", async (req, res, next) => {});

router.delete("/delete/patients", async (req, res, next) => {});
router.delete("/delete/state", async (req, res, next) => {});
router.delete("/delete/town", async (req, res, next) => {});
router.delete("/delete/township", async (req, res, next) => {});
router.delete("/delete/hospital", async (req, res, next) => {});

router.put("/edit/patients", async (req, res, next) => {});
router.put("/edit/state", async (req, res, next) => {});
router.put("/edit/town", async (req, res, next) => {});
router.put("/edit/township", async (req, res, next) => {});
router.put("/edit/hospital", async (req, res, next) => {});

module.exports = router;
