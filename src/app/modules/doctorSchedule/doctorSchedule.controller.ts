import { NextFunction, Request, Response } from "express";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const DoctorScheduleController = {
  createDoctorSchedules: catchAsync(
    async (
      req: Request & { user?: IJWTPayload },
      res: Response,
      next: NextFunction
    ) => {
      const user = req.user;
      const result = await DoctorScheduleServices.createDoctorSchedules(
        user as IJWTPayload,
        req.body
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result,
      });
    }
  ),
};
