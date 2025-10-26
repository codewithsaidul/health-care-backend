import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";






const router = Router();



router.post("/create-appointment", checkAuth(UserRole.PATIENT), AppointmentController.createAppointment)





export const AppointmentRoutes = router;