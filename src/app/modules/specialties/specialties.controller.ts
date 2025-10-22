import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { SpecialtiesServices } from "./specialties.service";
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const SpecialtiesController = {
  createSpecialties: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesServices.createSpecialties(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Specialties created successfully!",
      data: result,
    });
  }),
};
