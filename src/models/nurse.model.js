import mongoose from "mongoose";
const nurseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      required: true,
      default: "Morning",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true }
);
const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;
