const { isAuth } = require("../../auth");
const router = require("express").Router();
const Patient = require("../../models/Patient");

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
  validatePatient,
  deleteValidation,
  removeNull,
} = require("../../util/utils");
router.get("/all", async (req, res, next) => {
  const patients = await Patient.find({})
    .populate({
      path: "town townShip hospital state",
      select: "-location -__v -town -state ",
    })
    .select("-__v -createdAt ");

  res.json(patients);
});

router.get("/states", async (req, res, next) => {
  const states = await State.find({});
  res.json(states);
});
router.get("/towns", async (req, res, next) => {
  const towns = await Town.find({}).populate({
    path: "state",
    select: "-location",
  });
  res.json(towns);
});
router.get("/townsname", async (req, res, next) => {
  const towns = await Town.find({});
  res.json(towns);
});
router.get("/townships", async (req, res, next) => {
  const townsships = await TownShip.find({})
    .populate({
      path: "town",
      select: "-state -__v",
    })
    .select("-__v");
  res.json(townsships);
});
router.get("/hospitals", async (req, res, next) => {
  const hospitals = await Hospitals.find({})
    .populate({
      path: "town",
      select: "-state -__v",
    })
    .select("-__v");
  res.json(hospitals);
});

router.post("/patient", isAuth, validatePatient(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const admin_id = req.user._id;
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
    contact_person,
  } = req.body;

  try {
    const patient = new Patient({
      patient_id,
      age,
      gender,
      state: state_id,
      hospital: hospital_id,
      town: town_id,
      townShip: towns_ship_id,
      oversea_country,
      date,
      contact_person,
      admin_id,
    });
    await patient.save();
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.post("/state", isAuth, validateState(), async (req, res, next) => {
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
router.post("/town", isAuth, validateTown(), async (req, res, next) => {
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
router.post("/township", isAuth, validateTownShip(), async (req, res, next) => {
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
router.post("/hospital", isAuth, validateHospital(), async (req, res, next) => {
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

router.delete("/patient/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await Patient.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});
router.delete("/state/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await State.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});
router.delete("/town/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await Town.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});
router.delete("/township/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await TownShip.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});
router.delete("/hospital/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await Hospitals.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});

router.put(
  "/patient/:id",
  isAuth,

  async (req, res, next) => {
    const admin_id = req.user._id;
    const { id } = req.params;
    try {
      const patient = await Patient.updateOne(
        { _id: id },
        { ...req.body, admin_id }
      );

      return res.status(200).json({ message: "complete" });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);
router.put("/state/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await State.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.put("/town/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Town.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.put("/township/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await TownShip.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.put("/hospital/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Hospitals.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
