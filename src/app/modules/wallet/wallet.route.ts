import express from "express";
import {
  addMoneyToOwnWallet,
  getMyWalletTransactions,
  getWallet,
  getWalletByUserId,
  sendMoneyToAnotherUser,
  withdrawFromOwnWallet,
} from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get("/me", checkAuth(...Object.values(Role)), getWallet);

router.post("/:userId", checkAuth(...Object.values(Role)), getWalletByUserId);

router.post("/me/add-money", checkAuth(Role.USER), addMoneyToOwnWallet);

router.post("/me/withdraw", checkAuth(Role.USER), withdrawFromOwnWallet);
router.post("/me/send-money", checkAuth(Role.USER), sendMoneyToAnotherUser);
router.get(
  "/my-transactions",
  checkAuth(...Object.values(Role)),
  getMyWalletTransactions
);

export const WalletRoutes = router;
