import mongoose, { mongo, Schema } from "mongoose";

export interface ParsedTransaction {
  in: number;
  out: number;
  date: Date;
  description: string;
  additionalInfo: object;
}

const ParsedTransactionSchema = new Schema({
  in: {
    type: Number,
    required: true,
  },
  out: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  additionalInfo: {
    type: Object,
    required: true,
  },
});

const ParsedFileSchema = new Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
  },
  acc: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  transactions: {
    type: [ParsedTransactionSchema],
    required: true,
  },
  fixedData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("ParsedFile", ParsedFileSchema);
