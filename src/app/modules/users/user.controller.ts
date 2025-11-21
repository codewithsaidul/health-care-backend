import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { userFilterableFields } from "./user.constants";
import { UserServices } from "./user.service";

export const UserController = {
  createPatient: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await UserServices.createPatient(req.body, req.file);

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
      const result = await UserServices.createAdmin(req.body, req.file);

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
      const result = await UserServices.createDoctor(req.body, req.file);

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Doctor Created Successfully!",
        data: result,
      });
    }
  ),
  getAllUsers: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const filters = pick(req.query, userFilterableFields); // searching , filtering
      const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); // pagination and sorting
      const result = await UserServices.getAllUsers(filters, options);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All Users Retrived Successfully!",
        data: result,
      });
    }
  ),

  getMyProfile: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;

      const result = await UserServices.getMyProfile(user as IJWTPayload);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My profile data fetched!",
        data: result,
      });
    }
  ),

  updateMyProfie: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;

      const result = await UserServices.updateMyProfile(
        user as IJWTPayload,
        req.body,
        req.file as Express.Multer.File
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My profile updated!",
        data: result,
      });
    }
  ),

  changeProfileStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.changeProfileStatus(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users profile status changed!",
      data: result,
    });
  }),
};
