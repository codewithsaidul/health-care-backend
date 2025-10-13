import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { createPatientZodSchema } from "./user.validation";





const router = Router();


router.post("/create-patient", fileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    req.body = createPatientZodSchema.parse(JSON.parse(req.body.data))
    return UserController.createPatient(req, res, next)
})


export const UserRoutes = router