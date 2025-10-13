import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const UserController = {
  createPatient: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.createPatient(req.body, req.file)

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Patient Created Successfully!",
        data: result,
      });
    }
  ),
  createAdmin: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.createAdmin(req.body, req.file)

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Admin Created Successfully!",
        data: result,
      });
    }
  ),
  createDoctor: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.createDoctor(req.body, req.file)

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Doctor Created Successfully!",
        data: result,
      });
    }
  ),
};
