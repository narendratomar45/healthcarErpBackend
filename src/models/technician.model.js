import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Technician = mongoose.model("Technician", technicianSchema);
export default Technician;
