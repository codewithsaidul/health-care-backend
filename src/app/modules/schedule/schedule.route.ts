import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { ScheduleController } from "./schedule.controller";



const router = Router();


router.post("/create-schedule", checkAuth(UserRole.ADMIN), ScheduleController.createSchedule)




export const ScheduleRoutes = router