/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Agent } from "./agent.model";
import bcrypt from "bcryptjs";

// Get agent profile
export const getAgentProfileController = async (req: Request, res: Response) => {
  try {
    const agentId = req.user._id; // from checkAuth middleware
    const agent = await Agent.findById(agentId).select("-password");
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update agent profile
export const updateAgentProfileController = async (req: Request, res: Response) => {
  try {
    const agentId = req.user._id;
    const { name, email, password } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    if (name) agent.name = name;
    if (email) agent.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      agent.password = await bcrypt.hash(password, salt);
    }

    await agent.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
