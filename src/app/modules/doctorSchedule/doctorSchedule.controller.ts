import { NextFunction, Request, Response } from "express";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { scheduleFilterableFields } from "./doctorSchedule.constants";
import pick from "../../utils/pick";

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

  getMySchedule: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
      const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

      const user = req.user;
      const result = await DoctorScheduleServices.getMySchedule(
        filters,
        options,
        user as IJWTPayload
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result,
      });
    }
  ),

  getAllDoctorSchedules: catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleServices.getAllDoctorSchedule(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Doctor Schedule retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }),

  deleteSchedule: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await DoctorScheduleServices.deleteSchedule(
        user as IJWTPayload,
        id
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result,
      });
    }
  ),

};
