import { Wallet } from "./wallet.model";

export const getWalletByUser = async (userId: string) => {
  return await Wallet.findOne({ user: userId });
};

export const updateBalance = async (userId: string, amount: number) => {
  const wallet = await getWalletByUser(userId);
  if (!wallet) throw new Error("Wallet not found");

  if (wallet.isBlocked) throw new Error("Wallet is blocked");

  wallet.balance += amount;
  await wallet.save();
  return wallet;
};
