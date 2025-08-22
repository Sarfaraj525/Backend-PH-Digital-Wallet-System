"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.getAllUsers);
router.get("/wallets", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.getAllWallets);
router.get("/transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.getAllTransactions);
router.patch("/wallets/block/:walletId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.blockWallet);
router.patch("/wallets/unblock/:walletId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.unblockWallet);
router.patch("/agents/approve/:agentId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.approveAgent);
router.patch("/agents/suspend/:agentId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.suspendAgent);
exports.AdminRoutes = router;
