import express from "express";
import {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatient,
  updatePatient,
} from "../controllers/patient.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { patientValidationSchema } from "../validators/patientRegistration.validation.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
  .route("/")
  .post(
    validate(patientValidationSchema),
    protect,
    authorizedRole("admin", "patient", "receptionist"),
    createPatient
  )
  .get(protect, authorizedRole("admin", "receptionist"), getAllPatients);
router
  .route("/:id")
  .get(protect, authorizedRole("admin", "patient", "receptionist"), getPatient)
  .put(protect, authorizedRole("admin", "patient"), updatePatient)
  .delete(protect, authorizedRole("admin"), deletePatient);
export default router;
