import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJWTPayload } from "../../types/common.types";
import { ReviewServices } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const ReviewController = {
  createReview: catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewServices.createReview(user as IJWTPayload, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
})
};
