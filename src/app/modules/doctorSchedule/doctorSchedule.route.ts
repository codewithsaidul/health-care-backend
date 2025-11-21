import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDoctorScheduleZodSchema } from "./doctorSchedule.validation";




const router = Router();



router.post("/createDoctorSchedule", validateRequest(createDoctorScheduleZodSchema), checkAuth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedules)



export const DoctorScheduleRoutes = router;