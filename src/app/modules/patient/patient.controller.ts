// patient.controller.ts
import { Request, Response } from "express";
import { PatientServices } from "./patient.service";
import { sendResponse } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { patientFilterableFields } from "./patient.constants";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";

export const PatientController = {
  getAllPatient: catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await PatientServices.getAllPatient(filters, options);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }),

  getPatientById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientServices.getPatientById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient retrieval successfully",
      data: result,
    });
  }),

  softDelete: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientServices.softDelete(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient soft deleted successfully",
      data: result,
    });
  }),

  updatePatient: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;
      const result = await PatientServices.updatePatient(
        user as IJWTPayload,
        req.body
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Patient updated successfully",
        data: result,
      });
    }
  ),
};
