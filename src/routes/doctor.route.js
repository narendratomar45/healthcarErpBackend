import express from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
} from "../controllers/doctor.controller.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
  .route("/:id")
  .post(protect, authorizedRole("admin"), createDoctor)
  .get(protect, authorizedRole("doctor", "admin"), getDoctor)
  .put(protect, authorizedRole("admin", "doctor"), updateDoctor)
  .delete(protect, authorizedRole("admin"), deleteDoctor);
router.route("/").get(protect, authorizedRole("admin"), getAllDoctors);
export default router;
