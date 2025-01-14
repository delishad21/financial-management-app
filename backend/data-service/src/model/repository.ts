import Transaction from "./transaction-model";
import { connect } from "mongoose";

export async function connectToDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  await connect(uri);
}

export async function createTransaction(
  userId: string,
  amount: number,
  type: string,
  date: Date,
  bank: string,
  acc: string,
  category: string,
  label: string,
  description: string,
  additionalInfo: object
) {
  return Transaction.create({
    userId,
    amount,
    type,
    date,
    bank,
    acc,
    category,
    label,
    description,
    additionalInfo,
  });
}

export async function updateTransaction(
  transactionId: string,
  amount: number,
  type: string,
  date: Date,
  bank: string,
  acc: string,
  category: string,
  label: string,
  description: string,
  additionalInfo: object
) {
  return Transaction.updateOne(
    { transactionId },
    {
      amount,
      type,
      date,
      bank,
      acc,
      category,
      label,
      description,
      additionalInfo,
    }
  );
}

export async function deleteTransaction(transactionId: string) {
  return Transaction.deleteOne({ transactionId });
}

export async function getTransactionById(transactionId: string) {
  return Transaction.findOne({ transactionId });
}

export async function getAllTransactionsOfUser(userId: string) {
  return Transaction.find({ userId });
}

export async function getFilteredTransactions(
  userId: string,
  category?: string,
  type?: string,
  bank?: string,
  acc?: string,
  startDate?: Date,
  endDate?: Date,
  minAmount?: number,
  maxAmount?: number
) {
  const filter: any = { userId };
  if (category) {
    filter.category = category;
  }
  if (type) {
    filter.type = type;
  }
  if (bank) {
    filter.bank = bank;
  }
  if (acc) {
    filter.acc = acc;
  }
  if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  }
  if (minAmount && maxAmount) {
    filter.amount = { $gte: minAmount, $lte: maxAmount };
  }
  return Transaction.find(filter);
}
