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
import patientRoutes from "./src/routes/patient.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import appoinmentRoutes from "./src/routes/appoinment.routes.js";
import labReportRoutes from "./src/routes/labReport.routes.js";
import technicianRoutes from "./src/routes/technician.routes.js";
import insurenceRoutes from "./src/routes/insurance.routes.js";
import admissionRoutes from "./src/routes/admission.routes.js";

app.use("/api/patients", patientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appoinment", appoinmentRoutes);
app.use("/api/labReport", labReportRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/insurance", insurenceRoutes);
app.use("/api/admissions", admissionRoutes);

app.use(globalErrorHandler);
export default app;
