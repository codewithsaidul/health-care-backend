import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

export const UserController = {
  createPatient: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.createPatient(req.body, req.file)

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient Created Successfully!",
        data: result,
      });
    }
  ),
};
