import Counter from "../models/counter.model.js";

const prefixMap = {
  patient: "P",
  doctor: "D",
  nurse: "N",
  pharmacist: "PH",
  labtech: "LT",
  receptionist: "R",
};
export const generateUniqueId = async (role) => {
  const prefix = prefixMap[role.toLowerCase()];
  if (!prefix) throw new Error("Invalid role provided");
  const counter = await Counter.findOneAndUpdate(
    { role },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const paddedSeq = String(counter.seq).padStart(4, "0");
  return `${prefix}${paddedSeq}`;
};
