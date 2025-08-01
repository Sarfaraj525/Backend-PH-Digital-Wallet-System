"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveSuspendAgent = exports.blockUnblockWallet = exports.getAllUsersAgents = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const getAllUsersAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({
        role: { $in: [user_interface_1.Role.USER, user_interface_1.Role.AGENT] },
    }).select("-password");
    return users;
});
exports.getAllUsersAgents = getAllUsersAgents;
const blockUnblockWallet = (walletId, block) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default("Wallet not found", http_status_codes_1.default.NOT_FOUND);
    }
    wallet.isBlocked = block;
    yield wallet.save();
    return wallet;
});
exports.blockUnblockWallet = blockUnblockWallet;
const approveSuspendAgent = (agentId, approve) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent || agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default("Agent not found", http_status_codes_1.default.NOT_FOUND);
    }
    agent.isVerified = approve;
    yield agent.save();
    const agentObj = agent.toObject();
    delete agentObj.password;
    return agentObj;
});
exports.approveSuspendAgent = approveSuspendAgent;
