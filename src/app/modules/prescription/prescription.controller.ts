import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";

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
}),



myPrescription: catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await PrescriptionService.myPrescription(user as IJWTPayload, options);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
})
};
