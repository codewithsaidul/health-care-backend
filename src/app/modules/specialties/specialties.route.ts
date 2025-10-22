import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { addSpecialities } from "./specialties.validation";
import { SpecialtiesController } from "./specialties.controller";




const router = Router();

router.post("/create-specialties", validateRequest(addSpecialities), SpecialtiesController.createSpecialties)
router.get("/getAllSpecialties", SpecialtiesController.getAllSpecialties)


export const SpecialtiesRoutes = router