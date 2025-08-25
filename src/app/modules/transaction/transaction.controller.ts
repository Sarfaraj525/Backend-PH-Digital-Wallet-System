/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
  cashOut,
  getMyTransactions,
  // getMyTransactions,
} from "./transaction.service";
// import { Transaction } from "./transaction.model";

export const addMoneyController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id as string;
    const result = await addMoney(userId, req.body.amount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const withdrawController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id as string;
    const result = await withdrawMoney(userId, req.body.amount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMoneyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = req.user._id as string;
    const { receiverEmail, amount } = req.body;

    const result = await sendMoney(senderId, receiverEmail, amount);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const cashInController = async (req: Request, res: Response) => {
  try {
    const agentId = req.user._id as string;
    const { userEmail, amount } = req.body;
    const result = await cashIn(agentId, userEmail, amount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cashOutController = async (req: Request, res: Response) => {
  try {
    const agentId = req.user._id as string;
    const { userEmail, amount } = req.body;
    const result = await cashOut(agentId, userEmail, amount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// export const myTransactionsController = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id as string;
//     const result = await getMyTransactions(userId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const myTransactionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const type = req.query.type as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const result = await getMyTransactions(userId, page, limit, type, startDate, endDate);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


