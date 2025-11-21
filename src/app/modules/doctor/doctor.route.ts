import { Router } from "express";
import { DoctorController } from "./doctor.controller";




const router = Router();



router.post("/aiDoctorSuggestion", DoctorController.getAiDoctorSuggestion);
router.get("/getAllDoctor", DoctorController.getAllDoctor);
router.get("/doctorDetails/:id", DoctorController.getSingleDoctor);
router.patch("/updateDoctor/:id", DoctorController.updateDoctor);
router.patch("/:id", DoctorController.softDelete);
router.patch("/:id", DoctorController.deleteDoctor);


export const DoctorRoutes = router