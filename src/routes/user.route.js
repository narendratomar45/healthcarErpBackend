import express from "express";
import {
  createUser,
  deleteUser,
  getAllusers,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authorizedRole, protect } from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/rateLimiter.middleware.js";
const router = express.Router();

router.post("/", createUser);
router.post("/login", loginLimiter, loginUser);
router.get("/", protect, authorizedRole("admin"), getAllusers);
router
  .route("/:id")
  .patch(protect, authorizedRole("admin", "patient"), updateUser)
  .delete(protect, authorizedRole("admin"), deleteUser)
  .get(protect, authorizedRole("admin", "patient"), getUser);
export default router;
