import { Request, Response, NextFunction } from "express";
import ConfigService from "../utils/parser-config";

async function loadBankConfig(req: Request, res: Response, next: NextFunction) {
  const bankName = req.body.bankName as string;

  if (!bankName) {
    res.status(400).json({ error: "Bank name is required" });
    return;
  }

  try {
    const config = await ConfigService.getConfig(bankName);
    req.body.bankConfig = config;
    next();
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Failed to load bank config: " + error.message });
  }
}

export default loadBankConfig;
