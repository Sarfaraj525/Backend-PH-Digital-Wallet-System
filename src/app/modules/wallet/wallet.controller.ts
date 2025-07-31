import { Request, Response, NextFunction } from "express";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Transaction } from "../transaction/transaction.model";
import mongoose from "mongoose";

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


wallet.balance+= req.body?.amount;

await wallet.save();

const transaction = await Transaction.create({
        type: "add_money",
        amount: req.body?.amount,
        receiver: userId,
        });
    
    res.status(200).json({
      success: true,
      message: "transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ adds money to user wallet



export const addMoneyToOwnWallet = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      throw new AppError("Amount must be a positive number", httpStatus.BAD_REQUEST);
    }

    const wallet = await Wallet.findOne({ user: req.user.userId }).session(session);
    if (!wallet) throw new AppError("Wallet not found", httpStatus.NOT_FOUND);

    wallet.balance += amount;
    await wallet.save({ session });

    const transaction = await Transaction.create([{
      type: "add_money",
      amount,
      receiver: req.user.userId,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      data: transaction[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const withdrawFromOwnWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      throw new AppError("Amount must be a positive number", httpStatus.BAD_REQUEST);
    }

    const wallet = await Wallet.findOne({ user: req.user.userId });
    if (!wallet) throw new AppError("Wallet not found", httpStatus.NOT_FOUND);

    if (wallet.balance < amount) {
      throw new AppError("Insufficient balance", httpStatus.BAD_REQUEST);
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = await Transaction.create({
      type: "withdraw",
      amount,
      sender: req.user.userId,
    });

    res.status(200).json({
      success: true,
      message: "Money withdrawn successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMoneyToAnotherUser = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { receiverId, amount } = req.body;

    if (!receiverId || !amount || amount <= 0) {
      throw new AppError("Receiver and valid amount required", httpStatus.BAD_REQUEST);
    }

    if (receiverId === req.user.userId) {
      throw new AppError("Cannot send money to yourself", httpStatus.BAD_REQUEST);
    }

    const senderWallet = await Wallet.findOne({ user: req.user.userId }).session(session);
    const receiverWallet = await Wallet.findOne({ user: receiverId }).session(session);

    if (!senderWallet || !receiverWallet) {
      throw new AppError("Sender or receiver wallet not found", httpStatus.NOT_FOUND);
    }

    if (senderWallet.balance < amount) {
      throw new AppError("Insufficient balance", httpStatus.BAD_REQUEST);
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = await Transaction.create([{
      type: "send",
      amount,
      sender: req.user.userId,
      receiver: receiverId,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      data: transaction[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getMyWalletTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id || req.user.userId;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "email role")
      .populate("receiver", "email role");

    res.status(200).json({
      success: true,
      message: "Transaction history retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};



