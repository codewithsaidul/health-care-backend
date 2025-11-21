import express from "express";
import { PatientController } from "./patient.controller";

import { UserRole } from "@prisma/client";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.get("/getAllPatient", PatientController.getAllPatient);

router.get("/:id", PatientController.getPatientById);

router.patch("/", checkAuth(UserRole.PATIENT), PatientController.updatePatient);

router.delete("/soft/:id", PatientController.softDelete);

export const PatientRoutes = router;
