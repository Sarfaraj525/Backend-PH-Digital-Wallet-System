import { z } from "zod";

export const approveSuspendAgentSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  approve: z.boolean(),
});

export const blockUnblockWalletSchema = z.object({
  walletId: z.string().min(1, "Wallet ID is required"),
  block: z.boolean(),
});
