import fs from "fs"; // To handle file streams
import csvParser from "csv-parser"; // For parsing CSV files
import moment from "moment"; // For handling and formatting dates
import { ParsedTransaction } from "../model/parsed-data-model";
import ParsedFile from "../model/parsed-data-model";

export function extractFixedData(
  filePath: string,
  fixedData: Record<string, { row: number; col: number }>
): Record<string, string> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n"); // Split into lines

  const extractedData: Record<string, string> = {};

  for (const [key, { row, col }] of Object.entries(fixedData)) {
    const line = lines[row - 1]; // Adjust for 1-based row index
    if (line) {
      const cells = line.split(","); // Split the line into columns
      extractedData[key] = cells[col - 1]?.trim() || ""; // Adjust for 1-based column index
    } else {
      extractedData[key] = ""; // Handle missing rows gracefully
    }
  }

  return extractedData;
}

export function parseBankCSV(
  filePath: string,
  config: any
): Promise<ParsedTransaction[]> {
  const { headerRowStart, headers, fixedData, dateFormat } = config;

  return new Promise((resolve, reject) => {
    const transactions: ParsedTransaction[] = [];
    const additionalInfoHeaders = new Set<string>();

    fs.createReadStream(filePath)
      .pipe(csvParser({ skipLines: headerRowStart }))
      .on("headers", (csvHeaders) => {
        csvHeaders.forEach((header: any) => {
          if (!Object.values(headers).flat().includes(header)) {
            additionalInfoHeaders.add(header);
          }
        });
      })
      .on("data", (row) => {
        if (!row[headers.date]) {
          return;
        }
        try {
          const inAmount = parseFloat(row[headers.in] || "0") || 0;
          const outAmount = parseFloat(row[headers.out] || "0") || 0;

          const transaction: ParsedTransaction = {
            in: inAmount,
            out: outAmount,
            date: moment(row[headers.date], dateFormat).toDate(),
            description: headers.description
              .map((header: string) => row[header])
              .filter(Boolean)
              .join(" "),
            additionalInfo: {
              ...Array.from(additionalInfoHeaders).reduce(
                (info: any, header) => {
                  info[header] = row[header];
                  return info;
                },
                {}
              ),
            },
          };

          transactions.push(transaction);
        } catch (err) {
          console.error("Error parsing row:", row, err);
        }
      })
      .on("end", () => resolve(transactions))
      .on("error", (err) => reject(err));
  });
}

export function retrieveParsedData(documentId: string) {
  return ParsedFile.findOne({ documentId: documentId });
}

export async function uploadParsedData(
  fixedData: any,
  transactions: ParsedTransaction[],
  filename: string,
  bank: string
) {
  try {
    const newParsedFile = new ParsedFile({
      documentId: filename,
      acc: fixedData.acc,
      bank: bank,
      transactions: transactions,
      fixedData: fixedData,
      createdAt: new Date(),
    });

    await newParsedFile.save();
  } catch (error: any) {
    console.error("Error uploading parsed data:", error);
    throw new Error("Failed to upload parsed data");
  }
}
