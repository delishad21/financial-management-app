import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the upload directory exists
const uploadDirectory = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDirectory); // Save files to the 'uploads/csv' directory
  },
  filename: (req: any, file: any, cb: any) => {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt);
    cb(null, `${baseName}-${timestamp}${fileExt}`); // Example: data-1675909876543.csv
  },
});

// File filter to allow only CSV files
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ["text/csv", "application/vnd.ms-excel"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only CSV files are allowed"), false); // Reject the file
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB file size limit
  },
  fileFilter,
});

export default upload;
