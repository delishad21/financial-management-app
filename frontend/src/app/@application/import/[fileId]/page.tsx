"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import DashboardCard from "@/components/shared/DashboardCard";
import { useParams } from "next/navigation";

const ParsedDataPage = () => {
  const { fileId } = useParams();

  const [selectedBank, setSelectedBank] = useState("");
  const [tableData, setTableData] = useState([
    { accountNumber: "12345678", bankName: "Bank A", amount: "1000" },
    { accountNumber: "87654321", bankName: "Bank B", amount: "2000" },
  ]);

  const handleBankChange = (event: any) => {
    setSelectedBank(event.target.value);
  };

  useEffect(() => {
    // Fetch parsed data using fileId (replace with real API call)

    // Or maybe import page should push data to this page? Not sure.
    console.log(`Fetching parsed data for file ID: ${fileId}`);
  }, [fileId]);

  return (
    <DashboardCard>
      <Box>
        <Typography variant="h6" mb={2}>
          Parsed Information
        </Typography>

        {/* Section 2.1: Essential Information */}
        <Box display="flex" gap={2} mb={4}>
          <TextField label="Account Number" variant="outlined" fullWidth />
          <TextField label="Bank Name" variant="outlined" fullWidth />
          <TextField label="Transaction Date" variant="outlined" fullWidth />
        </Box>

        {/* Section 2.2: Parsed Information Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={row.accountNumber}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.bankName}
                      onChange={(e) => {
                        const updatedData = [...tableData];
                        updatedData[index].bankName = e.target.value;
                        setTableData(updatedData);
                      }}
                      fullWidth
                    >
                      <MenuItem value="Bank A">Bank A</MenuItem>
                      <MenuItem value="Bank B">Bank B</MenuItem>
                      <MenuItem value="Bank C">Bank C</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardCard>
  );
};

export default ParsedDataPage;
