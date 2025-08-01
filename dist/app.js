"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const routes_1 = require("./app/routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin_route_1 = require("./app/modules/admin/admin.route");
const transaction_route_1 = require("./app/modules/transaction/transaction.route");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Digital Wallet API System Backend",
    });
});
app.use("/api/v1/admin", admin_route_1.AdminRoutes);
app.use('/api/v1/transaction', transaction_route_1.TransactionRoutes);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
