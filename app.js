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

import { globalErrorHandler } from "./src/middlewares/errorMiddleware.js";
import { generalRateLimiter } from "./src/middlewares/rateLimiter.middleware.js";
import patientRoutes from "./src/routes/patient.route.js";
import userRoutes from "./src/routes/user.route.js";
import doctorRoutes from "./src/routes/doctor.route.js";
import appoinmentRoutes from "./src/routes/appoinment.route.js";
import labReportRoutes from "./src/routes/labReport.route.js";
import technicianRoutes from "./src/routes/technician.route.js";
import insurenceRoutes from "./src/routes/insurance.route.js";

app.use("/api/patients", patientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appoinment", appoinmentRoutes);
app.use("/api/labReport", labReportRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/insurance", insurenceRoutes);
app.use(globalErrorHandler);

export default app;
