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
exports.updateBalance = exports.getWalletByUser = void 0;
const wallet_model_1 = require("./wallet.model");
const getWalletByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_model_1.Wallet.findOne({ user: userId });
});
exports.getWalletByUser = getWalletByUser;
const updateBalance = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, exports.getWalletByUser)(userId);
    if (!wallet)
        throw new Error("Wallet not found");
    if (wallet.isBlocked)
        throw new Error("Wallet is blocked");
    wallet.balance += amount;
    yield wallet.save();
    return wallet;
});
exports.updateBalance = updateBalance;
