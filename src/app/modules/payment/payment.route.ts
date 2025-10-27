// payment.route.ts
import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();
router.post("/", PaymentController.create);
router.get("/", PaymentController.index);

export default router;
