import { Request, Response, NextFunction } from "express";
import * as AdminService from "./admin.service";
import httpStatus from "http-status-codes";

export const getAllUsersAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsersAgents();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Users and agents retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUnblockWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walletId = req.params.id;
    const { block } = req.body;

    const wallet = await AdminService.blockUnblockWallet(walletId, block);

    res.status(httpStatus.OK).json({
      success: true,
      message: `Wallet has been ${block ? "blocked" : "unblocked"}`,
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

export const approveSuspendAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.params.id;
    const { approve } = req.body;

    const agent = await AdminService.approveSuspendAgent(agentId, approve);

    res.status(httpStatus.OK).json({
      success: true,
      message: `Agent has been ${approve ? "approved" : "suspended"}`,
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};
