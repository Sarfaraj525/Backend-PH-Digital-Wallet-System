import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Role } from "../user/user.interface";

export const getAllUsersAgents = async () => {
  const users = await User.find({
    role: { $in: [Role.USER, Role.AGENT] },
  }).select("-password");
  return users;
};

export const blockUnblockWallet = async (walletId: string, block: boolean) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) {
    throw new AppError("Wallet not found", httpStatus.NOT_FOUND);
  }

  wallet.isBlocked = block;
  await wallet.save();

  return wallet;
};

export const approveSuspendAgent = async (
  agentId: string,
  approve: boolean
) => {
  const agent = await User.findById(agentId);

  if (!agent || agent.role !== Role.AGENT) {
    throw new AppError("Agent not found", httpStatus.NOT_FOUND);
  }

  agent.isVerified = approve;
  await agent.save();

  const agentObj = agent.toObject();
  delete agentObj.password;

  return agentObj;
};
