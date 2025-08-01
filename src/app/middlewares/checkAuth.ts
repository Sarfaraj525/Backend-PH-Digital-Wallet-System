import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken =
        req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        throw new AppError("No token received", 403);
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      console.log(verifiedToken);

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError("You are not permitted to view this route", 403);
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
