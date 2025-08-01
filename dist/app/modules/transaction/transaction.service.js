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
exports.getMyTransactions = exports.cashOut = exports.cashIn = exports.sendMoney = exports.withdrawMoney = exports.addMoney = void 0;
const transaction_model_1 = require("./transaction.model");
const wallet_model_1 = require("../wallet/wallet.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Add Money
const addMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet || wallet.isBlocked)
            throw new Error("Wallet not found or blocked");
        wallet.balance += amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([{ type: "add_money", amount, receiver: userId }], { session });
        yield session.commitTransaction();
        return { message: "Money added successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.addMoney = addMoney;
// Withdraw Money
const withdrawMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet || wallet.isBlocked)
            throw new Error("Wallet not found or blocked");
        if (wallet.balance < amount)
            throw new Error("Insufficient balance");
        wallet.balance -= amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([{ type: "withdraw", amount, sender: userId }], { session });
        yield session.commitTransaction();
        return { message: "Withdraw successful" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.withdrawMoney = withdrawMoney;
// Send Money (User to User)
const sendMoney = (senderId, receiverEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const receiver = yield user_model_1.User.findOne({ email: receiverEmail }).session(session);
        if (!receiver)
            throw new Error("Receiver not found");
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: senderId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiver._id }).session(session);
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
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield transaction_model_1.Transaction.create([{
                type: "send_money",
                amount,
                sender: senderId,
                receiver: receiver._id,
            }], { session });
        yield session.commitTransaction();
        return { message: "Money sent successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.sendMoney = sendMoney;
// Cash In (Agent adds money to user)
const cashIn = (agentId, userEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findOne({ email: userEmail }).session(session);
        if (!user)
            throw new Error("User not found");
        const wallet = yield wallet_model_1.Wallet.findOne({ user: user._id }).session(session);
        if (!wallet || wallet.isBlocked)
            throw new Error("User wallet not found or blocked");
        wallet.balance += amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([{ type: "cash_in", amount, sender: agentId, receiver: user._id }], { session });
        yield session.commitTransaction();
        return { message: "Cash-in successful" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.cashIn = cashIn;
// Cash Out (Agent withdraws money from user)
const cashOut = (agentId, userEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findOne({ email: userEmail }).session(session);
        if (!user)
            throw new Error("User not found");
        const wallet = yield wallet_model_1.Wallet.findOne({ user: user._id }).session(session);
        if (!wallet || wallet.isBlocked)
            throw new Error("User wallet not found or blocked");
        if (wallet.balance < amount)
            throw new Error("Insufficient balance in user's wallet");
        wallet.balance -= amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([{ type: "cash_out", amount, sender: user._id, receiver: agentId }], { session });
        yield session.commitTransaction();
        return { message: "Cash-out successful" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.cashOut = cashOut;
// Get My Transactions (for user/agent)
const getMyTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ sender: userId }, { receiver: userId }],
    })
        .sort({ createdAt: -1 })
        .populate("sender", "email role")
        .populate("receiver", "email role");
    return transactions;
});
exports.getMyTransactions = getMyTransactions;
