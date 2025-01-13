import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["in", "out"], // Restrict to "In" or "Out"
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  additionalInfo: {
    type: Object,
    required: false,
  },
});

export default mongoose.model("Transaction", TransactionSchema);
