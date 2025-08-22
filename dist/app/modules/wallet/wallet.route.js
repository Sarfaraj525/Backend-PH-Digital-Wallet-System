"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wallet_controller_1.getWallet);
router.post("/:userId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wallet_controller_1.getWalletByUserId);
router.post("/me/add-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.addMoneyToOwnWallet);
router.post("/me/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.withdrawFromOwnWallet);
router.post("/me/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.sendMoneyToAnotherUser);
router.get("/my-transactions", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), wallet_controller_1.getMyWalletTransactions);
exports.WalletRoutes = router;
