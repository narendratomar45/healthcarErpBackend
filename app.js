import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalRateLimiter);

import patientRoutes from "./src/routes/patient.route.js";
import { globalErrorHandler } from "./src/middlewares/errorMiddleware.js";
import userRoutes from "./src/routes/user.route.js";
import doctorRoutes from "./src/routes/doctor.route.js";
import { generalRateLimiter } from "./src/middlewares/rateLimiter.middleware.js";

app.use("/api/patients", patientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);

app.use(globalErrorHandler);

export default app;
