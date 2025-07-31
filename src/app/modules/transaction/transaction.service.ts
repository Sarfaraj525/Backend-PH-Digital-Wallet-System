import { Transaction } from "./transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

// Add Money
export const addMoney = async (userId: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet || wallet.isBlocked) throw new Error("Wallet not found or blocked");

    wallet.balance += amount;
    await wallet.save({ session });

    await Transaction.create([{ type: "add_money", amount, receiver: userId }], { session });

    await session.commitTransaction();
    return { message: "Money added successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Withdraw Money
export const withdrawMoney = async (userId: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet || wallet.isBlocked) throw new Error("Wallet not found or blocked");

    if (wallet.balance < amount) throw new Error("Insufficient balance");

    wallet.balance -= amount;
    await wallet.save({ session });

    await Transaction.create([{ type: "withdraw", amount, sender: userId }], { session });

    await session.commitTransaction();
    return { message: "Withdraw successful" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Send Money (User to User)
export const sendMoney = async (senderId: string, receiverEmail: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const receiver = await User.findOne({ email: receiverEmail }).session(session);
    if (!receiver) throw new Error("Receiver not found");

    const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
    const receiverWallet = await Wallet.findOne({ user: receiver._id }).session(session);

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
      [{
        type: "send_money",
        amount,
        sender: senderId,
        receiver: receiver._id,
      }],
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

// Cash In (Agent adds money to user)
export const cashIn = async (agentId: string, userEmail: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet || wallet.isBlocked) throw new Error("User wallet not found or blocked");

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

// Cash Out (Agent withdraws money from user)
export const cashOut = async (agentId: string, userEmail: string, amount: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet || wallet.isBlocked) throw new Error("User wallet not found or blocked");

    if (wallet.balance < amount) throw new Error("Insufficient balance in user's wallet");

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

// Get My Transactions (for user/agent)
export const getMyTransactions = async (userId: string) => {
  const transactions = await Transaction.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "email role")
    .populate("receiver", "email role");

  return transactions;
};
