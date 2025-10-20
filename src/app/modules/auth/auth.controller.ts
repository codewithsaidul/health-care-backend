import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./aut.service";
import { sendResponse } from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setAuthCookie";




export const AuthController = {
    login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AuthServices.login(req.body)

        const { accessToken, refreshToken } = createUserToken(result)

        setAuthCookie(res, { accessToken, refreshToken })

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Logged in successfull",
            data: {
                user: result,
                accessToken,
                refreshToken
            }
        })
    })
}