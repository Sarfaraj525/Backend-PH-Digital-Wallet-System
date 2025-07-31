import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  getAllUsersAgents,
  blockUnblockWallet,
  approveSuspendAgent,
} from "./admin.controller";

const router = express.Router();

router.get("/users-agents", checkAuth("admin", "super_admin"), getAllUsersAgents);

router.patch("/wallets/:id/block", checkAuth("admin", "super_admin"), blockUnblockWallet);

router.patch("/agents/:id/status", checkAuth("admin", "super_admin"), approveSuspendAgent);

// export default router;
export const AdminRoutes = router;