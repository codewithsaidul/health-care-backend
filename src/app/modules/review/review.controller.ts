import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJWTPayload } from "../../types/common.types";
import { ReviewServices } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../utils/pick";
import { reviewFilterableFields } from "./review.constants";

export const ReviewController = {
  createReview: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;
      const result = await ReviewServices.createReview(
        user as IJWTPayload,
        req.body
      );
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review created successfully",
        data: result,
      });
    }
  ),



  getAllReviews: catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewServices.getAllReviews(filters, options);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
})
};
