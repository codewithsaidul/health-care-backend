// analytics.controller.ts
import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

export const AnalyticsController = {
  async create(req: Request, res: Response) {
    const data = await AnalyticsService.create(req.body);
    res.json(data);
  },
  async index(req: Request, res: Response) {
    const list = await AnalyticsService.findAll();
    res.json(list);
  },
};
