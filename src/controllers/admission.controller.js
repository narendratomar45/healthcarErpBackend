import Admission from "../models/Admission.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createAdmission = asyncHandler(async (req, res) => {
  const { patient, admittedBy, roomNumber, bedNumber, reasonForAdmission } =
    req.body;

  if (
    !patient ||
    !admittedBy ||
    !roomNumber ||
    !bedNumber ||
    !reasonForAdmission
  ) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  const admission = await Admission.create({
    patient,
    admittedBy,
    roomNumber,
    bedNumber,
    reasonForAdmission,
  });

  res.status(201).json({ success: true, admission });
});

export const getAllAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.find()
    .populate("patient")
    .populate("admittedBy");

  res.status(200).json({ success: true, count: admissions.length, admissions });
});

export const getSingleAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id)
    .populate("patient")
    .populate("admittedBy");

  if (!admission) {
    res.status(404);
    throw new Error("Admission not found");
  }

  res.status(200).json({ success: true, admission });
});

export const updateAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id);

  if (!admission) {
    res.status(404);
    throw new Error("Admission not found");
  }

  const updates = req.body;
  const updatedAdmission = await Admission.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );

  res.status(200).json({ success: true, updatedAdmission });
});

export const dischargePatient = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id);

  if (!admission) {
    res.status(404);
    throw new Error("Admission not found");
  }

  if (admission.isDischarged) {
    res.status(400);
    throw new Error("Patient already discharged");
  }

  admission.dischargeDate = new Date();
  admission.isDischarged = true;
  admission.status = "Discharged";
  admission.notes = req.body.notes || "";

  await admission.save();

  res
    .status(200)
    .json({ success: true, message: "Patient discharged", admission });
});

export const deleteAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id);

  if (!admission) {
    res.status(404);
    throw new Error("Admission not found");
  }

  await admission.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Admission deleted successfully" });
});
