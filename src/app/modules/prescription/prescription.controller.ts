import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";

export const PrescriptionController = {
  createPrescription: catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "prescription created successfully!",
        data: result
    })
})
};
