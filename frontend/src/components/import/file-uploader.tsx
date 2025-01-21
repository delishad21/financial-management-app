import { Box, Typography, Button, Select, MenuItem } from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import React from "react";

interface FileUploaderProps {
  handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
  uploadedFile: File | null;
  selectedBank: string;
  setSelectedBank: React.Dispatch<React.SetStateAction<string>>;
  handleParse: () => void;
  uploadStatus: string;
}

const FileUploader = ({
  handleFileChange,
  uploadedFile,
  selectedBank,
  setSelectedBank,
  handleParse,
  uploadStatus,
}: FileUploaderProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <DashboardCard>
        <Box p={2}>
          <Typography variant="h6" mb={2}>
            Upload Files
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              alignItems="center"
            >
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  fullWidth
                >
                  Upload File
                </Button>
              </label>
              {uploadedFile ? (
                <Typography variant="body1" align="center">
                  {uploadedFile.name}
                </Typography>
              ) : (
                <Typography variant="body1" align="center">
                  No file selected
                </Typography>
              )}
            </Box>
            <Box display="flex" flexDirection="row" gap={3}>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                displayEmpty
                fullWidth
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select a Bank
                </MenuItem>
                <MenuItem value="dbs">DBS</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleParse}
                component="span"
                fullWidth
              >
                Parse
              </Button>
            </Box>
          </Box>
          {uploadStatus && (
            <Typography variant="body1" mt={2}>
              {uploadStatus}
            </Typography>
          )}
        </Box>
      </DashboardCard>
    </Box>
  );
};

export default FileUploader;
