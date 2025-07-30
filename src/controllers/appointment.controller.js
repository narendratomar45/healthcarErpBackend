import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import Patient from "../models/patient.model";
import { asyncHandler } from "../utils/AsyncHandler";

export const createAppointment = asyncHandler(async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot, reason } = req.body;

    const existingPatient = await Patient.findById(patient);
    const existingDoctor = await Doctor.findById(doctor);

    if (!existingPatient || !existingDoctor) {
      return res.status(400).json({ message: "Invalid patient or doctor ID" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
