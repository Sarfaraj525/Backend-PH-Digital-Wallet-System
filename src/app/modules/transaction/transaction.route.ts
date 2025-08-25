import express from "express";
import { cashInController, cashOutController, myTransactionsController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";


const router = express.Router();

router.get("/me", checkAuth(Role.USER), myTransactionsController);

router.post("/cash-in", checkAuth("AGENT"), cashInController);

router.post("/cash-out", checkAuth("AGENT"), cashOutController);

export const TransactionRoutes = router;


