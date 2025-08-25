/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { cashInController, cashOutController, getAgentSummaryController, myTransactionsController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import { getAgentTransactions } from "./transaction.service";


const router = express.Router();

router.get("/me", checkAuth(Role.USER), myTransactionsController);

router.post("/cash-in", checkAuth("AGENT"), cashInController);

router.post("/cash-out", checkAuth("AGENT"), cashOutController);

router.get("/agent-summary", checkAuth(Role.AGENT), getAgentSummaryController);

// Agent transactions (NEW)
router.get("/agent", checkAuth(Role.AGENT), async (req, res) => {
  try {
    const agentId = req.user._id; // from checkAuth middleware
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const transactions = await getAgentTransactions(agentId, page, limit);
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export const TransactionRoutes = router;


