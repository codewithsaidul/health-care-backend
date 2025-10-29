import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { StatusCodes } from "http-status-codes";

export const AuthController = {
  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.login(req.body);

    const { accessToken, refreshToken } = createUserToken(result);

    setAuthCookie(res, { accessToken, refreshToken });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged in successfull",
      data: {
        user: result,
        accessToken,
        refreshToken,
      },
    });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);
    res.cookie("accessToken", result.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Access token genereated successfully!",
      data: {
        message: "Access token genereated successfully!",
      },
    });
  }),

  changePassword: catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
      const user = req.user;

      const result = await AuthServices.changePassword(user, req.body);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Password Changed successfully",
        data: result,
      });
    }
  ),

  forgotPassword: catchAsync(async (req: Request, res: Response) => {
    await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Check your email!",
      data: null,
    });
  }),

  resetPassword: catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await AuthServices.resetPassword(token, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password Reset!",
      data: null,
    });
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const userSession = req.cookies;
    const result = await AuthServices.getMe(userSession);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User retrive successfully!",
      data: result,
    });
  }),
};
