import express from "express";
import { getWallet, getWalletByUserId } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

// Authenticated user's own wallet
router.get("/me", checkAuth("user", "admin", "agent", "super_admin"), getWallet);

// Admin gets wallet by user ID
router.get(
  "/:userId",
  checkAuth("admin", "super_admin"), // Only admins/super_admins can access this
  getWalletByUserId
);

// export default router;
export const WalletRoutes = router;
