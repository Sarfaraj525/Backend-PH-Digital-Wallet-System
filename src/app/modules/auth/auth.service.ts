/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError("Email does not exist", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError("Incorrect Password", httpStatus.BAD_REQUEST);
  }

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError("User does not exist", httpStatus.BAD_REQUEST);
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      `User is ${isUserExist.isActive}`,
      httpStatus.BAD_REQUEST
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is Deleted", httpStatus.BAD_REQUEST);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const { password: pass, ...rest } = isUserExist.toObject();

  const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(
      refreshToken
    );

    return {
      accessToken: newAccessToken,
    };
  };

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
