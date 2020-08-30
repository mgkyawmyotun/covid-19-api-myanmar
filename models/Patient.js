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
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "hospitals",
      required: true,
    },
    town: {
      type: Schema.Types.ObjectId,
      ref: "towns",
      required: true,
    },
    townShip: {
      type: Schema.Types.ObjectId,
      ref: "townships",
      required: true,
    },
    contact_person: {
      type: String,
    },
    oversea_country: {
      type: String,
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
