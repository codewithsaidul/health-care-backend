import { UserRole } from "@prisma/client";
import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { createDoctorScheduleZodSchema } from "./doctorSchedule.validation";

const router = Router();

router.post(
  "/createDoctorSchedule",
  validateRequest(createDoctorScheduleZodSchema),
  checkAuth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedules
);

router.get(
  "/getAllSchedules",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleController.getAllDoctorSchedules
);

router.get(
  "/my-schedule",
  checkAuth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

router.delete(
  "/:id",
  checkAuth(UserRole.DOCTOR),
  DoctorScheduleController.deleteSchedule
);

export const DoctorScheduleRoutes = router;
