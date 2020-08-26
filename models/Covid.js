const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CovidSchema = new mongoose.Schema(
  {
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    patient_id: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "states",
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "hospitals",
    },
    town: {
      type: Schema.Types.ObjectId,
      ref: "towns",
    },
    townShip: {
      type: Schema.Types.ObjectId,
      ref: "townships",
    },
    contact_person: {
      type: String,
      ref: "patients",
    },
    oversea: {
      type: Schema.Types.ObjectId,
      ref: "countries",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Covid = mongoose.model("patients", CovidSchema);
module.exports = Covid;
