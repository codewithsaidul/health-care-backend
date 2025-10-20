import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";

const checkAuth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new Error("You are not authorized!")
            }

            const verifyUser = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET);

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authorized!")
            }

            next();
        }
        catch (err) {
            next(err)
        }
    }
}

export default checkAuth;