import Bill from "../models/bill.model.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

export const createBill = asyncHandler(async (req, res) => {
  const { patient, services, totalAmount, paymentMethod, paid, paymentDate } =
    req.body;

  if (!patient || !services || !totalAmount) {
    throw new APIError("Patient, services, and total amount are required", 400);
  }

  const newBill = await Bill.create({
    patient,
    services,
    totalAmount,
    paid,
    paymentMethod,
    paymentDate,
  });

  res.status(201).json({
    success: true,
    message: "Bill created successfully",
    data: newBill,
  });
});

export const getAllBill = asyncHandler(async (req, res) => {
  const bills = await Bill.find()
    .populate("patient", "fullName email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: bills.length,
    data: bills,
  });
});

export const getBillById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid Bill ID", 400);
  }

  const bill = await Bill.findById(id).populate(
    "patient",
    "fullName email phone"
  );

  if (!bill) {
    throw new APIError("Bill not found", 404);
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

export const updateBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid Bill ID", 400);
  }

  const bill = await Bill.findById(id);
  if (!bill) {
    throw new APIError("Bill not found", 404);
  }

  Object.assign(bill, updates);
  await bill.save();

  res.status(200).json({
    success: true,
    message: "Bill updated successfully",
    data: bill,
  });
});

export const deleteBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid Bill ID", 400);
  }

  const bill = await Bill.findByIdAndDelete(id);
  if (!bill) {
    throw new APIError("Bill not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Bill deleted successfully",
  });
});
