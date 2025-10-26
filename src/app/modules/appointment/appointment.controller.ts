import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJWTPayload } from "../../types/common.types";
import { AppointmentServices } from "./appointment.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const AppointmentController = {
  createAppointment: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
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
};
