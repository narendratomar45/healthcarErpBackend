import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";
import Technician from "../models/technician.model.js";

export const createTechnician = asyncHandler(async (req, res) => {
  const { user, qualification, experience, address } = req.body;

  if (!user || !address) {
    throw new APIError("User ID and Address ID are required", 400);
  }

  const existingTech = await Technician.findOne({ user });
  if (existingTech) {
    throw new APIError("Technician already exists for this user", 409);
  }

  const newTechnician = await Technician.create({
    user,
    qualification,
    experience,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Technician created successfully",
    data: newTechnician,
  });
});

export const getAllTechnician = asyncHandler(async (req, res) => {
  const technicians = await Technician.find()
    .populate("user", "fullName email role phone")
    .populate("address");

  res.status(200).json({
    success: true,
    results: technicians.length,
    data: technicians,
  });
});

export const getTechnicianById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid technician ID", 400);
  }

  const technician = await Technician.findById(id)
    .populate("user", "fullName email role phone")
    .populate("address");

  if (!technician) {
    throw new APIError("Technician not found", 404);
  }

  res.status(200).json({
    success: true,
    data: technician,
  });
});

export const updateTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid technician ID", 400);
  }

  const technician = await Technician.findById(id);
  if (!technician) {
    throw new APIError("Technician not found", 404);
  }

  Object.keys(updates).forEach((key) => {
    technician[key] = updates[key];
  });

  await technician.save();

  res.status(200).json({
    success: true,
    message: "Technician updated successfully",
    data: technician,
  });
});

export const deleteTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid technician ID", 400);
  }

  const technician = await Technician.findByIdAndDelete(id);
  if (!technician) {
    throw new APIError("Technician not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Technician deleted successfully",
  });
});


