import { UserStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import { IUser } from "../users/user.interface";
import bcrypt from "bcryptjs";
import { AppError } from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import { generateToken, verifyToken } from "../../utils/jwt";
import { Secret } from "jsonwebtoken";
import emailSender from "../../helpers/emailSender";
import { StatusCodes } from "http-status-codes";

export const AuthServices = {
  login: async (payload: Partial<IUser>) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.ACTIVE,
      },
    });

    const isPassMatched = await bcrypt.compare(
      payload.password as string,
      user.password
    );

    if (!isPassMatched) {
      throw new AppError(400, "Password is wrong");
    }

    // 🧹 remove password before returning
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },

  refreshToken: async (token: string) => {
    let decodedData;
    try {
      decodedData = verifyToken(token, envVars.JWT.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error("You are not authorized!");
    }

    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: decodedData.email,
        status: UserStatus.ACTIVE,
      },
    });

    const accessToken = generateToken(
      {
        email: userData.email,
        role: userData.role,
      },
      envVars.JWT.JWT_ACCESS_SECRET,
      envVars.JWT.JWT_ACCESS_EXPIRATION_TIME
    );

    return {
      accessToken,
      needPasswordChange: userData.needPasswordChange,
    };
  },

  changePassword: async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: UserStatus.ACTIVE,
      },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
      payload.oldPassword,
      userData.password
    );

    if (!isCorrectPassword) {
      throw new Error("Password incorrect!");
    }

    const hashedPassword: string = await bcrypt.hash(
      payload.newPassword,
      Number(10)
    );

    await prisma.user.update({
      where: {
        email: userData.email,
      },
      data: {
        password: hashedPassword,
        needPasswordChange: false,
      },
    });

    return {
      message: "Password changed successfully!",
    };
  },

  forgotPassword: async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.ACTIVE,
      },
    });

    const resetPassToken = generateToken(
      { email: userData.email, role: userData.role },
      envVars.JWT.JWT_RESET_SECRET,
      envVars.JWT.JWT_RESET_EXPIRE
    );

    const resetPassLink =
      envVars.FRONTEND_URL + `?userId=${userData.id}&token=${resetPassToken}`;

    await emailSender(
      userData.email,
      `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    );
  },

  resetPassword: async (
    token: string,
    payload: { id: string; password: string }
  ) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        id: payload.id,
        status: UserStatus.ACTIVE,
      },
    });

    const isValidToken = verifyToken(token, envVars.JWT.JWT_RESET_SECRET);

    if (!isValidToken) {
      throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
    }

    // hash password
    const password = await bcrypt.hash(payload.password, Number(10));

    // update into database
    await prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        password,
      },
    });
  },

  getMe: async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = verifyToken(accessToken, envVars.JWT.JWT_ACCESS_SECRET);

    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: decodedData.email,
        status: UserStatus.ACTIVE,
      },
    });

    const { id, email, role, needPasswordChange, status } = userData;

    return {
      id,
      email,
      role,
      needPasswordChange,
      status,
    };
  },
};
