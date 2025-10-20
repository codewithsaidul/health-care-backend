import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { ScheduleController } from "./schedule.controller";



const router = Router();


router.post("/create-schedule", checkAuth(UserRole.ADMIN), ScheduleController.createSchedule)

router.get(
    "/getSchedules",
    checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleController.schedulesForDoctor
)


router.delete("/deleteSchedule/:scheduleId", checkAuth(UserRole.ADMIN), ScheduleController.deleteSchedule)

export const ScheduleRoutes = router