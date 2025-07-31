// src/modules/admin/admin.routes.ts

import express from "express";
import {
  getAllUsers,
  getAllWallets,
  getAllTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
} from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get("/users", checkAuth(Role.ADMIN), getAllUsers);
router.get("/wallets", checkAuth(Role.ADMIN), getAllWallets);
router.get("/transactions", checkAuth(Role.ADMIN), getAllTransactions);

router.patch("/wallets/block/:walletId", checkAuth(Role.ADMIN), blockWallet);
router.patch("/wallets/unblock/:walletId", checkAuth(Role.ADMIN), unblockWallet);

router.patch("/agents/approve/:agentId", checkAuth(Role.ADMIN), approveAgent);
router.patch("/agents/suspend/:agentId", checkAuth(Role.ADMIN), suspendAgent);

export const AdminRoutes = router;
