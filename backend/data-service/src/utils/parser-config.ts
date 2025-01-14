import fs from "fs";
import path from "path";
import moment from "moment";

class ConfigService {
  private static configs: Record<string, any> = {};

  static async getConfig(bankName: string): Promise<any> {
    if (!this.configs[bankName]) {
      const configPath = path.join(
        __dirname,
        `../utils/bank-config/${bankName}.json`
      );
      this.configs[bankName] = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
    return this.configs[bankName];
  }
}

export default ConfigService;
