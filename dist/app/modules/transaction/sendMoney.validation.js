"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoneySchema = void 0;
const zod_1 = require("zod");
exports.sendMoneySchema = zod_1.z.object({
    receiverEmail: zod_1.z.string().email(),
    amount: zod_1.z.number().positive("Amount must be positive"),
});
