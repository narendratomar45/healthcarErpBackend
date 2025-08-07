import express from "express";
import { authorizedRole, protect } from "../middlewares/authMiddleware";
import {
  createNurse,
  deleteNurse,
  getAllNurses,
  getNurseByID,
  updateNurse,
} from "../controllers/nurse.controller";
const router = express.Router();
router
  .route("/")
  .post(protect, authorizedRole("admin"), createNurse)
  .get(protect, authorizedRole("admin"), getAllNurses);
router
  .route("/:id")
  .get(protect, authorizedRole("nurse", "admin"), getNurseByID)
  .put(protect, authorizedRole("admin", "nurse"), updateNurse)
  .delete(protect, authorizedRole("admin"), deleteNurse);
