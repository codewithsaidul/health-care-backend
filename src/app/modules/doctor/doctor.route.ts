import { Router } from "express";
import { DoctorController } from "./doctor.controller";




const router = Router();



router.get("/getAllDoctor", DoctorController.getAllDoctor);
router.patch("/updateDoctor/:id", DoctorController.updateDoctor);


export const DoctorRoutes = router