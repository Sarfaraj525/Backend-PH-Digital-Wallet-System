import { Schema, model } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
