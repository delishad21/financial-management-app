import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer";
import loadBankConfig from "../middleware/bank-config-retriever";
import {
  extractFixedData,
  parseBankCSV,
  retrieveParsedData,
  uploadParsedData,
} from "../controller/csv-parser-controller";
import File from "../model/parsed-data-model";

const parserRouter = Router();

parserRouter.post(
  "/csv",
  upload.single("csvFile"),
  loadBankConfig,
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const bank = req.body.bankName;
    const filePath = req.file.path; // Path to the uploaded file
    const fileName = req.file.filename; // Name of the uploaded file
    const { bankConfig } = req.body;

    if (filePath) {
      try {
        const transactions = await parseBankCSV(filePath, bankConfig);
        console.log("transactions", transactions);
        const fixedData = extractFixedData(filePath, bankConfig.fixedData);
        await uploadParsedData(fixedData, transactions, fileName, bank);
        res.status(200).json({ message: "CSV parsed successfully", fileName });
      } catch (error: any) {
        res
          .status(500)
          .json({ error: "Failed to parse CSV", details: error.message });
      }
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  }
);

parserRouter.get(
  "/retrieve/:documentId",
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    console.log(documentId);
    try {
      const parsedData = retrieveParsedData(documentId);
      res.status(200).json(parsedData);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to retrieve parsed data: " + error.message });
    }
  }
);

export default parserRouter;
