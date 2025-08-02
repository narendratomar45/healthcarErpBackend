import express from "express";
import {
  createLabReport,
  deleteLabReport,
  getAllLabReport,
  getLabReportByID,
  updateLabReport,
} from "../controllers/labReport.controller.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(protect, authorizedRole("technician"), createLabReport)
  .get(protect, authorizedRole("admin", "technician"), getAllLabReport);
router
  .route("/:id")
  .get(protect, authorizedRole("technician", "admin"), getLabReportByID)
  .put(protect, authorizedRole("technician", "admin"), updateLabReport)
  .delete(protect, authorizedRole("admin"), deleteLabReport);
export default router;
