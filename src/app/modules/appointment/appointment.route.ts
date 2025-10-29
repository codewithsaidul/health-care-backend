import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";






const router = Router();



router.post("/create-appointment", checkAuth(UserRole.PATIENT), AppointmentController.createAppointment)
router.get("/getAllAppointment",  AppointmentController.getAllAppointment)
router.get("/getMyAllAppointment", checkAuth(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMyAppointment)
router.patch("/update-appointment/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), AppointmentController.updateAppointmentStatus)





export const AppointmentRoutes = router;