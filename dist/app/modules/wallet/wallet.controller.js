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
exports.getMyWalletTransactions = exports.sendMoneyToAnotherUser = exports.withdrawFromOwnWallet = exports.addMoneyToOwnWallet = exports.getWalletByUserId = exports.getWallet = void 0;
const wallet_model_1 = require("./wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_model_1 = require("../transaction/transaction.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield wallet_model_1.Wallet.findOne({ user: req.user.userId });
        if (!wallet) {
            throw new AppError_1.default("Wallet not found", http_status_codes_1.default.NOT_FOUND);
        }
        res.status(200).json({
            success: true,
            message: "Wallet retrieved successfully",
            data: wallet,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getWallet = getWallet;
const getWalletByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId } = req.params;
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
        if (!wallet) {
            throw new AppError_1.default("Wallet not found for the given user", http_status_codes_1.default.NOT_FOUND);
        }
        wallet.balance += (_a = req.body) === null || _a === void 0 ? void 0 : _a.amount;
        yield wallet.save();
        const transaction = yield transaction_model_1.Transaction.create({
            type: "add_money",
            amount: (_b = req.body) === null || _b === void 0 ? void 0 : _b.amount,
            receiver: userId,
        });
        res.status(200).json({
            success: true,
            message: "transaction retrieved successfully",
            data: transaction,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getWalletByUserId = getWalletByUserId;
const addMoneyToOwnWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            throw new AppError_1.default("Amount must be a positive number", http_status_codes_1.default.BAD_REQUEST);
        }
        const wallet = yield wallet_model_1.Wallet.findOne({ user: req.user.userId }).session(session);
        if (!wallet)
            throw new AppError_1.default("Wallet not found", http_status_codes_1.default.NOT_FOUND);
        wallet.balance += amount;
        yield wallet.save({ session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                type: "add_money",
                amount,
                receiver: req.user.userId,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: "Money added successfully",
            data: transaction[0],
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        next(error);
    }
});
exports.addMoneyToOwnWallet = addMoneyToOwnWallet;
const withdrawFromOwnWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            throw new AppError_1.default("Amount must be a positive number", http_status_codes_1.default.BAD_REQUEST);
        }
        const wallet = yield wallet_model_1.Wallet.findOne({ user: req.user.userId });
        if (!wallet)
            throw new AppError_1.default("Wallet not found", http_status_codes_1.default.NOT_FOUND);
        if (wallet.balance < amount) {
            throw new AppError_1.default("Insufficient balance", http_status_codes_1.default.BAD_REQUEST);
        }
        wallet.balance -= amount;
        yield wallet.save();
        const transaction = yield transaction_model_1.Transaction.create({
            type: "withdraw",
            amount,
            sender: req.user.userId,
        });
        res.status(200).json({
            success: true,
            message: "Money withdrawn successfully",
            data: transaction,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.withdrawFromOwnWallet = withdrawFromOwnWallet;
const sendMoneyToAnotherUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { receiverId, amount } = req.body;
        if (!receiverId || !amount || amount <= 0) {
            throw new AppError_1.default("Receiver and valid amount required", http_status_codes_1.default.BAD_REQUEST);
        }
        if (receiverId === req.user.userId) {
            throw new AppError_1.default("Cannot send money to yourself", http_status_codes_1.default.BAD_REQUEST);
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({
            user: req.user.userId,
        }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverId }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new AppError_1.default("Sender or receiver wallet not found", http_status_codes_1.default.NOT_FOUND);
        }
        if (senderWallet.balance < amount) {
            throw new AppError_1.default("Insufficient balance", http_status_codes_1.default.BAD_REQUEST);
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                type: "send",
                amount,
                sender: req.user.userId,
                receiver: receiverId,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: "Money sent successfully",
            data: transaction[0],
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        next(error);
    }
});
exports.sendMoneyToAnotherUser = sendMoneyToAnotherUser;
const getMyWalletTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id || req.user.userId;
        const transactions = yield transaction_model_1.Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "email role")
            .populate("receiver", "email role");
        res.status(200).json({
            success: true,
            message: "Transaction history retrieved successfully",
            data: transactions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyWalletTransactions = getMyWalletTransactions;
