import express from "express";
import { addMoneyToOwnWallet, getMyWalletTransactions, getWallet, getWalletByUserId, sendMoneyToAnotherUser, withdrawFromOwnWallet } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { cashInController } from "../transaction/transaction.controller";
// import { object } from "zod";

const router = express.Router();

// Authenticated user's own wallet
router.get("/me", checkAuth(...Object.values(Role)), getWallet);

// Admin gets wallet by user ID
router.post(
  "/:userId",
  checkAuth(...Object.values(Role)), // Only admins/super_admins can access this
  getWalletByUserId
);

router.post("/me/add-money", checkAuth(Role.USER), addMoneyToOwnWallet);

router.post("/me/withdraw", checkAuth(Role.USER), withdrawFromOwnWallet);
router.post("/me/send-money", checkAuth(Role.USER), sendMoneyToAnotherUser);
router.get("/my-transactions", checkAuth(...Object.values(Role)), getMyWalletTransactions);

// AGENT routes
router.post("/cash-in", checkAuth("agent"), cashInController);
// router.post("/cash-out", checkAuth("agent"), cashOutController);



// export default router;
export const WalletRoutes = router;
