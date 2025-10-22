import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import pick from "../../utils/pick";




export const DoctorController = {
    getAllDoctor: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields)

    const result = await DoctorServices.getAllDoctor(fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data
    })
})
}