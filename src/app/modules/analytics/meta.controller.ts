import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../types/common.types";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MetaServices } from "./meta.service";

export const MetaController = {
  fetchDashboardMetaData: catchAsync(
    async (req: Request & { user?: IJWTPayload }, res: Response) => {
      const user = req.user;
      const result = await MetaServices.fetchDashboardMetaData(
        user as IJWTPayload
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Meta data retrival successfully!",
        data: result,
      });
    }
  ),
};
