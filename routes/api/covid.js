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
  validateDistrict,
} = require("../../util/utils");
const CaseState = require("../../models/CaseState");
const CaseTown = require("../../models/CaseTown");
const District = require("../../models/District");
const CaseDistrict = require("../../models/CaseDistrict");
router.get("/getTotal", async (req, res, next) => {
  try {
    const caseStates = await CaseState.find({});
    const total = caseStates.reduce((ac, cs) => ({
      totalCase: ac.totalCase + cs.totalCase,
      totalDeath: ac.totalDeath + cs.totalDeath,
      recovered: ac.recovered + cs.recovered,
    }));
    res.json(total);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/getTotal/:name", async (req, res, next) => {
  const { name } = req.params;
  try {
    await CaseState.find()
      .populate({
        path: "state",
        select: "name",
      })
      .exec((err, result) => {
        try {
          const { totalCase, totalDeath, recovered } = result.filter(
            (r) => r.state.name.toLowerCase() == name.toLowerCase()
          )[0];
          res.json({
            totalCase,
            totalDeath,
            recovered,
          });
        } catch (error) {
          return res.status(400).json({ error: "State not found" });
        }
      });
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/all", async (req, res, next) => {
  try {
    const patients = await Patient.find({})

      .populate({
        path: "town townShip hospital state",
        select: "-location -__v -town -state ",
      })
      .select("-__v -createdAt ");

    res.json(patients);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/patient_id", async (req, res, next) => {
  try {
    const patients = await Patient.find({}).select("patient_id -_id");

    res.json(patients);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/states", async (req, res, next) => {
  try {
    const states = await State.find({});
    res.json(states);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/districts/:state_name", async (req, res, next) => {
  const { state_name } = req.params;
  try {
    let districts = [];
    await District.find({})
      .populate({
        path: "state",
        select: "name",
      })
      .exec((err, result) => {
        districts = result.filter(
          (r) => r.state.name.toLowerCase() === state_name.toLowerCase()
        );
        res.json(districts);
      })
      .catch((err) => res.status(500).json(err));
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/districts", async (req, res, next) => {
  try {
    const districts = await District.find({}).populate({
      path: "state",
      select: "name",
    });
    res.json(districts);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/towns", async (req, res, next) => {
  try {
    const towns = await Town.find({}).populate({
      path: "state",
      select: "-location",
    });
    res.json(towns);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/townsname", async (req, res, next) => {
  try {
    const towns = await Town.find({});
    res.json(towns);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/townships", async (req, res, next) => {
  try {
    const townsships = await TownShip.find({})

      .populate({
        path: "town",
        select: "-state -__v",
      })
      .select("-__v");
    res.json(townsships);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/hospitals", async (req, res, next) => {
  try {
    const hospitals = await Hospitals.find({})

      .populate({
        path: "town",
        select: "-state -__v",
      })
      .select("-__v");
    return res.json(hospitals);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/case/state", async (req, res, next) => {
  try {
    const caseState = await CaseState.find({}).populate({
      path: "state",
      select: "name",
    });

    return res.json(caseState);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/case/town", async (req, res, next) => {
  try {
    const caseTown = await CaseTown.find({}).populate({
      path: "town",
      select: "name",
    });

    res.json(caseTown);
  } catch (error) {
    res.status(500).json(error);
  }
});
// router.get("/case/town/:name", async (req, res, next) => {
//   const { name } = req.params;
//   const caseTown = await CaseTown.find({ name: name }).populate("town");
//   res.json(caseTown);
// });
router.get("/case/district", async (req, res, next) => {
  try {
    const caseDistrict = await CaseDistrict.find({}).populate({
      path: "district",
      select: "name",
    });
    res.json(caseDistrict);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/case/district/:state_name", async (req, res, next) => {
  const { state_name } = req.params;
  try {
    let districts = [];
    await CaseDistrict.find({})
      .populate({
        path: "district",
        select: "name state",
        populate: {
          path: "state",
          select: "name",
        },
      })
      .exec((err, result) => {
        districts = result.filter(
          (r) => r.district.state.name.toLowerCase() == state_name.toLowerCase()
        );
        res.json(districts);
      });
  } catch (error) {
    res.status(500).json(error);
  }
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
router.post("/district", isAuth, validateDistrict(), async (req, res, next) => {
  const errors = getErrorMessage(req);
  if (errors.length > 0) {
    return res.status(404).json(errors);
  }
  const { name, state_id } = req.body;
  try {
    const district = new District({ name, state: state_id });
    await district.save();
    return res.json(district);
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
router.post("/case/state", isAuth, async (req, res, next) => {
  const { state, totalDeath, totalCase, recovered } = req.body;
  try {
    const caseState = new CaseState({
      state,
      totalDeath,
      totalCase,
      recovered,
    });
    await caseState.save();
    return res.json(caseState);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});
router.post("/case/town", isAuth, async (req, res, next) => {
  const { town, totalDeath, totalCase, recovered } = req.body;
  try {
    const caseTown = new CaseTown({ town, totalDeath, totalCase, recovered });
    await caseTown.save();
    return res.json(caseTown);
  } catch (error) {
    return res.status(500).json({ error: "Server Side Error", error });
  }
});
router.post("/case/district", isAuth, async (req, res, next) => {
  const { district, totalDeath, totalCase, recovered } = req.body;
  try {
    const caseDistrict = new CaseDistrict({
      district,
      totalDeath,
      totalCase,
      recovered,
    });
    await caseDistrict.save();
    return res.json(caseDistrict);
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
router.delete("/district/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await District.deleteOne({ _id: id });
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
router.delete("/case/state/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await CaseState.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});

router.delete("/case/town/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await CaseTown.deleteOne({ _id: id });
    return res.json({ message: "Delete Complete" });
  } catch (error) {
    return res.json({ error: error });
  }
});
router.delete("/case/district/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id must include" });

  try {
    await CaseDistrict.deleteOne({ _id: id });
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
router.put("/district/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await District.updateOne({ _id: id }, req.body);

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
router.put("/case/state/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await CaseState.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.put("/case/town/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await CaseTown.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.put("/case/district/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await CaseDistrict.updateOne({ _id: id }, req.body);

    return res.status(200).json({ message: "complete" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get("/caseConnection.json", async (req, res, next) => {
  return res.json({
    elements: [
      {
        label: "A",
        type: "Letter",
        description: "This is A",
        tags: ["one", "two"],
      },
      {
        label: "B",
        type: "Letter",
        "Favorite Dessert": "shave ice",
      },
    ],
    connections: [
      {
        from: "A",
        to: "B",
        type: "likes",
      },
    ],
  });
});

module.exports = router;
