// prescription.route.ts
import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";

const router = Router();
router.post("/create-prescription", PrescriptionController.createPrescription);


export const PrescriptionRoutes = router
