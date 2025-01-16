"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import DashboardCard from "@/components/shared/DashboardCard";

const ImportPage = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const router = useRouter();

  const handleParse = () => {
    const fileId = "uniqueFileId123"; // Replace with real logic
    router.push(`/import/${fileId}`);
  };

  return (
    <PageContainer
      title="Import Page"
      description="Upload and parse your bank files"
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <DashboardCard>
          <Box>
            <Typography variant="h6" mb={2}>
              Upload Files
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button variant="contained" color="primary">
                Upload File
              </Button>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select a Bank
                </MenuItem>
                <MenuItem value="Bank A">Bank A</MenuItem>
                <MenuItem value="Bank B">Bank B</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleParse}
              >
                Parse
              </Button>
            </Box>
          </Box>
        </DashboardCard>
      </Box>
    </PageContainer>
  );
};

export default ImportPage;
