import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { appointmentFilterableFields } from "./appointment.constants";
import { AppointmentServices } from "./appointment.service";

export const AppointmentController = {
  createAppointment: catchAsync(
    async (
      req: Request & { user?: IJWTPayload },
      res: Response,
      next: NextFunction
    ) => {
      const user = req.user;
      const result = await AppointmentServices.createAppointment(
        user as IJWTPayload,
        req.body
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Appointment created successfully!",
        data: result,
      });
    }
  ),

  getAllAppointment: catchAsync(
    async (
      req: Request & { user?: IJWTPayload },
      res: Response,
      next: NextFunction
    ) => {
      const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
      const filters = pick(req.query, appointmentFilterableFields);
      const result = await AppointmentServices.getAllAppointment(
        filters,
        options
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment fetched successfully!",
        data: result,
      });
    }
  ),

  getMyAppointment: catchAsync(
    async (
      req: Request & { user?: IJWTPayload },
      res: Response,
      next: NextFunction
    ) => {
      const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
      const fillters = pick(req.query, ["status", "paymentStatus"]);
      const user = req.user;
      const result = await AppointmentServices.getMyAllAppointment(
        user as IJWTPayload,
        fillters,
        options
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment fetched successfully!",
        data: result,
      });
    }
  ),

  updateAppointmentStatus: catchAsync(
    async (
      req: Request & { user?: IJWTPayload },
      res: Response,
      next: NextFunction
    ) => {
      const { id } = req.params;
      const { status } = req.body;
      const user = req.user;

      const result = await AppointmentServices.updateAppointmentStatus(
        id,
        status,
        user as IJWTPayload
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment updated successfully!",
        data: result,
      });
    }
  ),
};
