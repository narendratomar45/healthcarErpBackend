import mongoose from "mongoose";
const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    emergencyContact: {
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
