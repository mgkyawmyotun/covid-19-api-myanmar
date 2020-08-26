const mongoose = require("mongoose");
const router = require("express").Router();
const Covid = require("../../models/Covid");
const State = require("../../models/State");
const Town = require("../../models/Town");
const TownShip = require("../../models/TownShip");
const Hospitals = require("../../models/Hospitals");
const {
  getErrorMessage,
  validateHospital,
  validateState,
  validateTown,
  validateTownShip,
} = require("../../util/utils");
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

router.post("/patient", async (req, res, next) => {
  const admin_id = req.user;
  const {
    patient_id,
    age,
    gender,
    state_id,
    hospital_id,
    town_id,
    towns_ship_id,
    oversea_country,
    date,
  } = req.body;
});
router.post("/state", validateState(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { name, location } = req.body;

  try {
    const state = new State({ name, location });
    await state.save();
    return res.json(state);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});
router.post("/town", validateTown(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { name, location, state_id } = req.body;

  try {
    const town = new Town({ name, location, state: state_id });
    await town.save();
    return res.json(town);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});
router.post("/township", validateTownShip(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { name, town_id } = req.body;

  try {
    const townShip = new TownShip({ name, town: town_id });
    await townShip.save();
    return res.json(townShip);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});
router.post("/hospital", validateHospital(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { name, town_id } = req.body;

  try {
    const hospital = new Hospitals({ name, town: town_id });
    await hospital.save();
    return res.json(hospital);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});

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

function isValidObjectId(id) {
  return new ObjectId(id) === id;
}
