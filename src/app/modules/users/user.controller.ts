import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";





export const UserController = {
    createPatient: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log("first", req.body)
    })
}