import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ScheduleServices } from "./schedule.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../utils/pick";
import { IJWTPayload } from "../../types/common.types";

export const ScheduleController = {
  createSchedule: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const schedule = await ScheduleServices.createSchedule(req.body);

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Schedule Created Successfully",
        data: schedule,
      });
    }
  ),

  schedulesForDoctor: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
      const fillters = pick(req.query, ["startDateTime", "endDateTime"]);

      const user = req.user;
      const result = await ScheduleServices.schedulesForDoctor(
        user as IJWTPayload,
        fillters,
        options
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule fetched successfully!",
        meta: result.meta,
        data: result.data,
      });
    }
  ),
};
