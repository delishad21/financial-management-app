import express, { Request, Response } from 'express';

const app = express();
const PORT = 7201;

// Middleware to parse JSON
app.use(express.json());

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Data Service!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


