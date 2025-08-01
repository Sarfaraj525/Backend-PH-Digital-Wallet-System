"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUnblockWalletSchema = exports.approveSuspendAgentSchema = void 0;
const zod_1 = require("zod");
exports.approveSuspendAgentSchema = zod_1.z.object({
    agentId: zod_1.z.string().min(1, "Agent ID is required"),
    approve: zod_1.z.boolean(),
});
exports.blockUnblockWalletSchema = zod_1.z.object({
    walletId: zod_1.z.string().min(1, "Wallet ID is required"),
    block: zod_1.z.boolean(),
});
