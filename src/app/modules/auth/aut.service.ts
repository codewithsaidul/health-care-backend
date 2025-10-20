import { UserStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import { IUser } from "../users/user.interface";
import bcrypt from "bcryptjs";
import { AppError } from "../../errorHelper/AppError";

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
};
