import LabReport from "../models/labReport.model.js";
import APIError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

export const createLabReport = asyncHandler(async (req, res) => {
  const {
    patient,
    testName,
    orderedBy,
    reportDate,
    resultSummary,
    status = "Pending",
  } = req.body;

  if (!patient || !testName || !orderedBy) {
    throw new APIError("Patient, test name and orderedBy are required", 400);
  }

  const labReport = await LabReport.create({
    patient,
    testName,
    orderedBy,
    technician: req.user._id,
    reportDate,
    resultSummary,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Lab report created successfully",
    data: labReport,
  });
});

export const getAllLabReport = asyncHandler(async (req, res) => {
  const reports = await LabReport.find()
    .populate("patient")
    .populate("doctor")
    .populate("technician");

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

export const getLabReportByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid report ID", 400);
  }

  const report = await LabReport.findById(id)
    .populate("patient")
    .populate("doctor")
    .populate("technician");

  if (!report) {
    throw new APIError("Lab report not found", 404);
  }

  res.status(200).json({
    success: true,
    data: report,
  });
});

export const updateLabReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid report ID", 400);
  }

  const report = await LabReport.findById(id);
  if (!report) {
    throw new APIError("Lab report not found", 404);
  }

  const updatableFields = ["testName", "reportDate", "resultSummary", "status"];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      report[field] = req.body[field];
    }
  });

  await report.save();

  res.status(200).json({
    success: true,
    message: "Lab report updated successfully",
    data: report,
  });
});

export const deleteLabReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new APIError("Invalid report ID", 400);
  }

  const report = await LabReport.findByIdAndDelete(id);
  if (!report) {
    throw new APIError("Lab report not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Lab report deleted successfully",
  });
});
