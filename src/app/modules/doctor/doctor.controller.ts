import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import pick from "../../utils/pick";
import { StatusCodes } from "http-status-codes";

export const DoctorController = {
  getAllDoctor: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
      const fillters = pick(req.query, doctorFilterableFields);

      const result = await DoctorServices.getAllDoctor(fillters, options);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data,
      });
    }
  ),

  getAiDoctorSuggestion: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

      const result = await DoctorServices.getAiDoctorSuggestion(req.body);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Suggestion Retrived successfully!",
        data: result
      });
    }
  ),

  updateDoctor: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const result = await DoctorServices.updateDoctor(id, req.body);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor updated successfully!",
        data: result,
      });
    }
  ),
};
