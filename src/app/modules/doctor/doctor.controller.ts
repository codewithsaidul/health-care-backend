import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";

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
        data: result,
      });
    }
  ),

  getSingleDoctor: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await DoctorServices.getSingleDoctor(id);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor  Retrived successfully!",
        data: result,
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

  deleteDoctor: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await DoctorServices.deleteDoctor(id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: result,
      });
    }
  ),

  softDelete: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await DoctorServices.softDelete(id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor soft deleted successfully",
        data: result,
      });
    }
  ),
};
