import Insurance from "../models/insurance.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createInsurance = asyncHandler(async (req, res) => {
  const {
    patient,
    providerName,
    policyNumber,
    insuranceType,
    coveragePercent,
    validFrom,
    validTill,
    isActive,
  } = req.body;

  const existingInsurance = await Insurance.findOne({ patient });
  if (existingInsurance) {
    res.status(400);
    throw new Error("Insurance already exists for this patient");
  }

  const insurance = await Insurance.create({
    patient,
    providerName,
    policyNumber,
    insuranceType,
    coveragePercent,
    validFrom,
    validTill,
    isActive,
  });

  res.status(201).json(insurance);
});

export const getAllInsurance = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === "patient") {
    query.patient = req.user._id;
  }

  const insurances = await Insurance.find(query).populate(
    "patient",
    "name email"
  );
  res.status(200).json(insurances);
});

export const getInsuranceById = asyncHandler(async (req, res) => {
  const insurance = await Insurance.findById(req.params.id).populate(
    "patient",
    "name email"
  );

  if (!insurance) {
    res.status(404);
    throw new Error("Insurance not found");
  }

  // Only allow patient to view their own insurance
  if (
    req.user.role === "patient" &&
    req.user._id.toString() !== insurance.patient._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this insurance");
  }

  res.status(200).json(insurance);
});

export const updateInsurance = asyncHandler(async (req, res) => {
  const insurance = await Insurance.findById(req.params.id);
  if (!insurance) {
    res.status(404);
    throw new Error("Insurance not found");
  }

  const updated = await Insurance.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json(updated);
});

export const deleteInsurance = asyncHandler(async (req, res) => {
  const insurance = await Insurance.findById(req.params.id);
  if (!insurance) {
    res.status(404);
    throw new Error("Insurance not found");
  }

  await insurance.deleteOne();
  res.status(200).json({ message: "Insurance deleted successfully" });
});
