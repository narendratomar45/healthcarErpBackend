import mongoose from "mongoose";
const receptionistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});
const Receptionist = mongoose.model("Receptionist", receptionistSchema);
export default Receptionist;
