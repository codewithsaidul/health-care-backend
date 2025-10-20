import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ScheduleServices } from "./schedule.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";






export const ScheduleController = {
    createSchedule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const schedule = await ScheduleServices.createSchedule(req.body);



        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Schedule Created Successfully",
            data: schedule
        })
    })
}