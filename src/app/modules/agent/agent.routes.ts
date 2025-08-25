import express from "express";
import { getAgentProfileController, updateAgentProfileController } from "./agent.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get("/profile", checkAuth(Role.AGENT), getAgentProfileController);
router.put("/profile", checkAuth(Role.AGENT), updateAgentProfileController);

export const AgentRoutes = router;
