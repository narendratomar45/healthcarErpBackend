import mongoose from "mongoose";
const appointmentSchema = new mongoose(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    reason: {
      type: String,
    },
  },
  { timeStamps: true }
);
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
