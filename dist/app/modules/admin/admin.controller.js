"use strict";
// src/modules/admin/admin.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspendAgent = exports.approveAgent = exports.unblockWallet = exports.blockWallet = exports.getAllTransactions = exports.getAllWallets = exports.getAllUsers = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
// Get all users or agents
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    res.status(200).json({ success: true, data: users });
});
exports.getAllUsers = getAllUsers;
// Get all wallets
const getAllWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find().populate("user", "email role");
    res.status(200).json({ success: true, data: wallets });
});
exports.getAllWallets = getAllWallets;
// Get all transactions
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find()
        .sort({ createdAt: -1 })
        .populate("sender", "email role")
        .populate("receiver", "email role");
    res.status(200).json({ success: true, data: transactions });
});
exports.getAllTransactions = getAllTransactions;
// Block a user wallet
const blockWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(walletId, { isBlocked: true }, { new: true });
    if (!wallet)
        return res
            .status(404)
            .json({ success: false, message: "Wallet not found" });
    res
        .status(200)
        .json({ success: true, message: "Wallet blocked", data: wallet });
});
exports.blockWallet = blockWallet;
// Unblock a user wallet
const unblockWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(walletId, { isBlocked: false }, { new: true });
    if (!wallet)
        return res
            .status(404)
            .json({ success: false, message: "Wallet not found" });
    res
        .status(200)
        .json({ success: true, message: "Wallet unblocked", data: wallet });
});
exports.unblockWallet = unblockWallet;
// Approve an agent
const approveAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    const user = yield user_model_1.User.findByIdAndUpdate(agentId, { isActive: true }, { new: true });
    if (!user || user.role !== user_interface_1.Role.AGENT) {
        return res.status(404).json({ success: false, message: "Agent not found" });
    }
    res
        .status(200)
        .json({ success: true, message: "Agent approved", data: user });
});
exports.approveAgent = approveAgent;
// Suspend an agent
const suspendAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId } = req.params;
    const user = yield user_model_1.User.findByIdAndUpdate(agentId, { isActive: false }, { new: true });
    if (!user || user.role !== user_interface_1.Role.AGENT) {
        return res.status(404).json({ success: false, message: "Agent not found" });
    }
    res
        .status(200)
        .json({ success: true, message: "Agent suspended", data: user });
});
exports.suspendAgent = suspendAgent;
