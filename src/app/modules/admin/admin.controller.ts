import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { Role } from "../user/user.interface";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
};

export const getAllWallets = async (req: Request, res: Response) => {
  const wallets = await Wallet.find().populate("user", "email role");
  res.status(200).json({ success: true, data: wallets });
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const transactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .populate("sender", "email role")
    .populate("receiver", "email role");

  res.status(200).json({ success: true, data: transactions });
};

export const blockWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: true },
    { new: true }
  );
  if (!wallet)
    return res
      .status(404)
      .json({ success: false, message: "Wallet not found" });
  res
    .status(200)
    .json({ success: true, message: "Wallet blocked", data: wallet });
};

export const unblockWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findByIdAndUpdate(
    walletId,
    { isBlocked: false },
    { new: true }
  );
  if (!wallet)
    return res
      .status(404)
      .json({ success: false, message: "Wallet not found" });
  res
    .status(200)
    .json({ success: true, message: "Wallet unblocked", data: wallet });
};

export const approveAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const user = await User.findByIdAndUpdate(
    agentId,
    { isActive: true },
    { new: true }
  );
  if (!user || user.role !== Role.AGENT) {
    return res.status(404).json({ success: false, message: "Agent not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Agent approved", data: user });
};

export const suspendAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const user = await User.findByIdAndUpdate(
    agentId,
    { isActive: false },
    { new: true }
  );
  if (!user || user.role !== Role.AGENT) {
    return res.status(404).json({ success: false, message: "Agent not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Agent suspended", data: user });
};
