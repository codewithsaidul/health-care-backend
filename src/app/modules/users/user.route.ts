import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import checkAuth from "../../middlewares/checkAuth";
import { UserController } from "./user.controller";
import {
  createAdminZodSchema,
  createDoctorZodSchema,
  createPatientZodSchema,
} from "./user.validation";

const router = Router();

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = createPatientZodSchema.parse(JSON.parse(req.body.data));
    return UserController.createPatient(req, res, next);
  }
);
router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = createAdminZodSchema.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = createDoctorZodSchema.parse(JSON.parse(req.body.data));
    return UserController.createDoctor(req, res, next);
  }
);

router.get("/getAllUsers", UserController.getAllUsers);
router.get(
  "/getMyProfile",
  checkAuth(...Object.values(UserRole)),
  UserController.getMyProfile
);

router.patch(
  "/:id/status",
  checkAuth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

export const UserRoutes = router;
