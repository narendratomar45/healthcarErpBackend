import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const { patient, doctor, date, timeSlot, reason } = req.body;

  const existingPatient = await Patient.findById(patient);
  const existingDoctor = await Doctor.findById(doctor);

  if (!existingPatient || !existingDoctor) {
    throw new ApiError("Invalid patient or doctor ID", 400);
  }

  const appointment = await Appointment.create({
    patient,
    doctor,
    date,
    timeSlot,
    reason,
  });

  res.status(201).json({ message: "Appointment created", appointment });
});

export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email")
    .populate("doctor", "name specialty");

  res.status(200).json({ count: appointments.length, appointments });
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id)
    .populate("patient", "name email")
    .populate("doctor", "name specialty");

  if (!appointment) {
    throw new ApiError("Appointment not found", 404);
  }

  res.status(200).json(appointment);
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot, status, reason } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError("Appointment not found", 404);
  }

  appointment.date = date ?? appointment.date;
  appointment.timeSlot = timeSlot ?? appointment.timeSlot;
  appointment.status = status ?? appointment.status;
  appointment.reason = reason ?? appointment.reason;

  const updatedAppointment = await appointment.save();

  res.status(200).json({ message: "Appointment updated", updatedAppointment });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError("Appointment not found", 404);
  }

  await appointment.deleteOne();

  res.status(200).json({ message: "Appointment deleted" });
});
