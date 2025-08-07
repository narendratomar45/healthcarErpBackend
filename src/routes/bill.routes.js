import express from "express";
import {
  createBill,
  deleteBill,
  getAllBill,
  updateBill,
} from "../controllers/bill.controller";
import { authorizedRole, protect } from "../middlewares/authMiddleware";
const router = express.Router();
router
  .route("/")
  .post(protect, authorizedRole("receptionist", "admin"), createBill)
  .get(protect, authorizedRole("admin", "receptionist"), getAllBill);
router
  .route("/:id")
  .get(protect, authorizedRole("receptionist", "admin", "patient"), updateBill)
  .put(protect, authorizedRole("admin", "receptionist"))
  .delete(protect, authorizedRole("admin"), deleteBill);

export default router;
