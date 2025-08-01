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
Object.defineProperty(exports, "__esModule", { value: true });
exports.myTransactionsController = exports.cashOutController = exports.cashInController = exports.sendMoneyController = exports.withdrawController = exports.addMoneyController = void 0;
const transaction_service_1 = require("./transaction.service");
const addMoneyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id; // consistently using _id
        const result = yield (0, transaction_service_1.addMoney)(userId, req.body.amount);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.addMoneyController = addMoneyController;
const withdrawController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const result = yield (0, transaction_service_1.withdrawMoney)(userId, req.body.amount);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.withdrawController = withdrawController;
const sendMoneyController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderId = req.user._id;
        const { receiverEmail, amount } = req.body;
        const result = yield (0, transaction_service_1.sendMoney)(senderId, receiverEmail, amount);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendMoneyController = sendMoneyController;
const cashInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.user._id;
        const { userEmail, amount } = req.body;
        const result = yield (0, transaction_service_1.cashIn)(agentId, userEmail, amount);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.cashInController = cashInController;
const cashOutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.user._id;
        const { userEmail, amount } = req.body;
        const result = yield (0, transaction_service_1.cashOut)(agentId, userEmail, amount);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.cashOutController = cashOutController;
const myTransactionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const result = yield (0, transaction_service_1.getMyTransactions)(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.myTransactionsController = myTransactionsController;
