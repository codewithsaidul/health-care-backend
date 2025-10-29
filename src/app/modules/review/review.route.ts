// review.route.ts
import { Router } from "express";
import { ReviewController } from "./review.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();
router.post("/create-review", checkAuth(UserRole.PATIENT), ReviewController.createReview);


export const ReviewRoutes = router;
