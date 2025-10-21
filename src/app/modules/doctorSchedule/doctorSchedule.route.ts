import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";




const router = Router();



router.post("/createDoctorSchedule", checkAuth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedules)



export const DoctorScheduleRoutes = router;