import { Request, Response, NextFunction } from "express";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

// GET /wallet/me
export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.userId });

    if (!wallet) {
      throw new AppError("Wallet not found", httpStatus.NOT_FOUND);
    }

    res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET /wallet/:userId
export const getWalletByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new AppError("Wallet not found for the given user", httpStatus.NOT_FOUND);
    }

    res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};
