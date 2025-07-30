import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  qualifications: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number,
    required: true,
  },

  profileImage: {
    type: String,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
