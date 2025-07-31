import express from "express";
import {
  addMoneyController,
  withdrawController,
  sendMoneyController,
  cashInController,
  cashOutController,
  myTransactionsController,
} from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { sendMoneySchema } from "./sendMoney.validation";

const router = express.Router();

// USER routes
router.post("/add-money", checkAuth("user"), addMoneyController);
router.post("/withdraw", checkAuth("user"), withdrawController);
router.post(
  "/send",
  checkAuth("user"),
  validateRequest(sendMoneySchema),
  sendMoneyController
);
router.get("/my-transactions", checkAuth("user"), myTransactionsController);

// AGENT routes
router.post("/cash-in", checkAuth("agent"), cashInController);
router.post("/cash-out", checkAuth("agent"), cashOutController);

// export default router;
export const TransactionRoutes = router;