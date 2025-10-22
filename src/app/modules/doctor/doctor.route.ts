import { Router } from "express";
import { DoctorController } from "./doctor.controller";




const router = Router();



router.get("/getAllDoctor", DoctorController.getAllDoctor)


export const DoctorRoutes = router