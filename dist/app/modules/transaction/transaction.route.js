"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const transaction_service_1 = require("./transaction.service");
const router = express_1.default.Router();
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), transaction_service_1.getMyTransactions);
// AGENT routes
router.post("/cash-in", (0, checkAuth_1.checkAuth)("AGENT"), transaction_controller_1.cashInController);
router.post("/cash-out", (0, checkAuth_1.checkAuth)("AGENT"), transaction_controller_1.cashOutController);
// export default router;
exports.TransactionRoutes = router;
