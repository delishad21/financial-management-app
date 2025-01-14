import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer";
import loadBankConfig from "../middleware/bank-config-retriever";
import {
  extractFixedData,
  parseBankCSV,
} from "../controller/csv-parser-controller";

const parserRouter = Router();

parserRouter.post(
  "/csv",
  upload.single("csvFile"),
  loadBankConfig,
  async (req: Request, res: Response) => {
    const filePath = req.file?.path; // Path to the uploaded file
    const { bankConfig } = req.body;

    if (filePath) {
      try {
        const transactions = await parseBankCSV(filePath, bankConfig);
        const fixedData = extractFixedData(filePath, bankConfig.fixedData);
        res.json({ fixedData, transactions });
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

export default parserRouter;
