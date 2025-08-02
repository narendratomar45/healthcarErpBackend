import express from "express";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
import {
  createInsurance,
  deleteInsurance,
  getAllInsurance,
  getInsuranceById,
  updateInsurance,
} from "../controllers/insurance.controller.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizedRole("admin", "receptionist"), createInsurance)
  .get(
    protect,
    authorizedRole("admin", "receptionist", "patient"),
    getAllInsurance
  );

router
  .route("/:id")
  .get(
    protect,
    authorizedRole("admin", "receptionist", "patient"),
    getInsuranceById
  )
  .put(protect, authorizedRole("admin", "receptionist"), updateInsurance)
  .delete(protect, authorizedRole("admin"), deleteInsurance);

export default router;
