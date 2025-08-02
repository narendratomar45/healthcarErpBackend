import mongoose from "mongoose";
const lebReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    testName: { type: String, required: true },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "technician" },
    reportDate: { type: Date },
    resultSummary: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const LabReport = mongoose.model("LabReport", lebReportSchema);
export default LabReport;
