import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import parserRouter from "./routes/parser-routes";

const app = express();
const PORT = 7201;
dotenv.config();

// Middleware to parse
app.use(cors());
app.use(express.json());

// Define a basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Data Service!");
});

// parser routes
app.use("/parser", parserRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
