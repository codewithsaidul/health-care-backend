import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { addSpecialities } from "./specialties.validation";
import { SpecialtiesController } from "./specialties.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";




const router = Router();

router.post("/create-specialties", validateRequest(addSpecialities), SpecialtiesController.createSpecialties)
router.get("/getAllSpecialties", SpecialtiesController.getAllSpecialties)
router.delete("/deleteSpecialties/:id", checkAuth(UserRole.ADMIN), SpecialtiesController.deleteSpecialties)


export const SpecialtiesRoutes = router