/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

export const addMoney = async (userId: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet || wallet.isBlocked)
      throw new Error("Wallet not found or blocked");

    wallet.balance += amount;
    await wallet.save({ session });

    await Transaction.create(
      [{ type: "add_money", amount, receiver: userId }],
      { session }
    );

    await session.commitTransaction();
    return { message: "Money added successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const withdrawMoney = async (userId: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet || wallet.isBlocked)
      throw new Error("Wallet not found or blocked");

    if (wallet.balance < amount) throw new Error("Insufficient balance");

    wallet.balance -= amount;
    await wallet.save({ session });

    await Transaction.create([{ type: "withdraw", amount, sender: userId }], {
      session,
    });

    await session.commitTransaction();
    return { message: "Withdraw successful" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const sendMoney = async (
  senderId: string,
  receiverEmail: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const receiver = await User.findOne({ email: receiverEmail }).session(
      session
    );
    if (!receiver) throw new Error("Receiver not found");

    const senderWallet = await Wallet.findOne({ user: senderId }).session(
      session
    );
    const receiverWallet = await Wallet.findOne({ user: receiver._id }).session(
      session
    );

    if (!senderWallet || senderWallet.isBlocked) {
      throw new Error("Sender wallet not found or is blocked");
    }

    if (!receiverWallet || receiverWallet.isBlocked) {
      throw new Error("Receiver wallet not found or is blocked");
    }

    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance in sender wallet");
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    await Transaction.create(
      [
        {
          type: "send_money",
          amount,
          sender: senderId,
          receiver: receiver._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { message: "Money sent successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const cashIn = async (
  agentId: string,
  userEmail: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet || wallet.isBlocked)
      throw new Error("User wallet not found or blocked");

    wallet.balance += amount;
    await wallet.save({ session });

    await Transaction.create(
      [{ type: "cash_in", amount, sender: agentId, receiver: user._id }],
      { session }
    );

    await session.commitTransaction();
    return { message: "Cash-in successful" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const cashOut = async (
  agentId: string,
  userEmail: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet || wallet.isBlocked)
      throw new Error("User wallet not found or blocked");

    if (wallet.balance < amount)
      throw new Error("Insufficient balance in user's wallet");

    wallet.balance -= amount;
    await wallet.save({ session });

    await Transaction.create(
      [{ type: "cash_out", amount, sender: user._id, receiver: agentId }],
      { session }
    );

    await session.commitTransaction();
    return { message: "Cash-out successful" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getMyTransactions = async (
  userId: string,
  page = 1,
  limit = 5,
  type?: string,
  startDate?: string,
  endDate?: string
) => {
  const query: any = { $or: [{ sender: userId }, { receiver: userId }] };

  if (type) query.type = type;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const totalItems = await Transaction.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", "email role")
    .populate("receiver", "email role");

  return {
    data: transactions,
    meta: { page, totalPages, totalItems },
  };
};

// Get all transactions handled by an agent
export const getAgentTransactions = async (
  agentId: string,
  page = 1,
  limit = 10
) => {
  const query: any = {
    $or: [{ sender: agentId }, { receiver: agentId }],
    type: { $in: ["cash_in", "cash_out"] },
  };

  const totalItems = await Transaction.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", "email role")
    .populate("receiver", "email role");

  return {
    data: transactions,
    meta: { page, totalPages, totalItems },
  };
};

// Get agent summary (cash-in & cash-out totals)
export const getAgentSummary = async (agentId: string) => {
  const [cashInAgg] = await Transaction.aggregate([
    { $match: { sender: agentId, type: "cash_in" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const [cashOutAgg] = await Transaction.aggregate([
    { $match: { receiver: agentId, type: "cash_out" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    cashIn: cashInAgg?.total || 0,
    cashOut: cashOutAgg?.total || 0,
  };
};