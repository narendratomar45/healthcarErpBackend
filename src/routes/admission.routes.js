import express from "express";
import {
  createAdmission,
  getAllAdmissions,
  getSingleAdmission,
  updateAdmission,
  dischargePatient,
  deleteAdmission,
} from "../controllers/admission.controller.js";

import { protect, authorizedRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizedRole("admin", "doctor"), createAdmission)
  .get(protect, authorizedRole("admin", "doctor", "nurse"), getAllAdmissions);

router
  .route("/:id")
  .get(protect, authorizedRole("admin", "doctor", "nurse"), getSingleAdmission)
  .patch(protect, authorizedRole("admin", "doctor"), updateAdmission)
  .delete(protect, authorizedRole("admin"), deleteAdmission);

router
  .route("/:id/discharge")
  .patch(protect, authorizedRole("doctor", "admin"), dischargePatient);

export default router;
