import { z } from "zod";

export const sendMoneySchema = z.object({
  receiverEmail: z.string().email(),
  amount: z.number().positive("Amount must be positive"),
});
