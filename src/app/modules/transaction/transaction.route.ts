import express from "express";
import { cashInController, cashOutController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import { getMyTransactions } from "./transaction.service";

const router = express.Router();

router.get("/me", checkAuth(Role.USER), getMyTransactions);

router.post("/cash-in", checkAuth("AGENT"), cashInController);

router.post("/cash-out", checkAuth("AGENT"), cashOutController);

export const TransactionRoutes = router;
