// analytics.route.ts
import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";

const router = Router();
router.post("/", AnalyticsController.create);
router.get("/", AnalyticsController.index);

export default router;
