/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

// Update logged-in user profile
const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const payload = req.body;

  const user = await UserServices.updateUser(decodedToken.userId, payload, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: user,
  });
});

// const updateUser = catchAsync(async (req, res) => {
//   const verifiedToken = req.user as JwtPayload;
//   const userId = verifiedToken.userId; // 👈 from token, not params
//   const payload = req.body;

//   const user = await UserServices.updateUser(userId, payload, verifiedToken);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "User Updated Successfully",
//     data: user,
//   });
// });



const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

export const UserController = {
  createUser,
  getAllUsers,
  // updateUser,
  updateMe,
  getMe,
};
