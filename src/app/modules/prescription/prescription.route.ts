// prescription.route.ts
import { Router } from "express";
import { PrescriptionController } from "./prescription.controller";

const router = Router();


router.post("/create-prescription", PrescriptionController.createPrescription);
router.get("/my-prescription", PrescriptionController.myPrescription);


export const PrescriptionRoutes = router
