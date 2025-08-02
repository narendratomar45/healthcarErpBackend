import express from "express";
import {
  createTechnician,
  deleteTechnician,
  getAllTechnician,
  getTechnicianById,
  updateTechnician,
} from "../controllers/technician.controller.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
  .route("/")
  .post(protect, authorizedRole("admin"), createTechnician)
  .get(protect, authorizedRole("admin"), getAllTechnician);
router
  .route("/:id")
  .get(protect, authorizedRole("admin"), getTechnicianById)
  .put(protect, authorizedRole("admin"), updateTechnician)
  .delete(protect, authorizedRole("admin"), deleteTechnician);
export default router;
