import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      unique: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
      unique: true,
    },
    insuranceType: {
      type: String,
      enum: ["Government", "Private", "Employer-Provided", "Other"],
      default: "Private",
    },
    coveragePercent: {
      type: Number,
      default: 0, // e.g., 80% coverage
      min: 0,
      max: 100,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // documentUrl: {
    //   type: String, // (optional) upload scanned copy of insurance card
    // },
  },
  { timestamps: true }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);
export default Insurance;
