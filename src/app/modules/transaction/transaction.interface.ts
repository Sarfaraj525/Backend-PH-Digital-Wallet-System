// src/modules/transaction/transaction.interface.ts
import { Document, Types } from "mongoose";

export type TransactionType =
  | "add_money"
  | "withdraw"
  | "send"
  | "cash_in"
  | "cash_out";

export interface ITransaction extends Document {
  type: TransactionType;
  amount: number;
  sender?: Types.ObjectId;
  receiver?: Types.ObjectId;
  status: "success" | "failed";
  timestamp: Date;
}
