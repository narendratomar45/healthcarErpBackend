import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    admittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    reasonForAdmission: {
      type: String,
      required: true,
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
    },
    isDischarged: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Discharged", "Transferred"],
      default: "Active",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
