import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAgent extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: "AGENT";
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const agentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["AGENT"], default: "AGENT" },
  },
  { timestamps: true }
);

// Password compare method
agentSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const Agent: Model<IAgent> = mongoose.model<IAgent>("Agent", agentSchema);
