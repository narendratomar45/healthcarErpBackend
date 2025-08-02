import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointment,
} from "../controllers/appointment.controller.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorizedRole("patient", "doctor", "admin", "receptionist"),
    createAppointment
  )
  .get(protect, authorizedRole("admin", "doctor"), getAllAppointments);
router
  .route("/:id")
  .put(
    protect,
    authorizedRole(
      protect,
      authorizedRole("patient", "doctor", "admin", "receptionist")
    ),
    updateAppointment
  )
  .delete(protect, authorizedRole("admin"), deleteAppointment);

export default router;
