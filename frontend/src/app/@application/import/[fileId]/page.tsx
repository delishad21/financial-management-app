"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { fetchParsedData } from "@/services/parsing-service";
import PageContainer from "@/components/container/PageContainer";
import dateColumnType from "@/components/editor/GridEditDateCell";
import { rest } from "lodash";
import dayjs from "dayjs";

interface Transaction {
  id: number;
  in: number;
  out: number;
  date: string;
  description: string;
  additionalInfo: Record<string, string>;
  label?: string;
  category?: string;
}

const ParsedDataPage = () => {
  const { fileId } = useParams();
  if (!fileId || typeof fileId !== "string") return null;

  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Abstracted Function: Update a transaction in the state
  const updateTransaction = (id: number, updatedData: Partial<Transaction>) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedData } : transaction
      )
    );
  };

  // Abstracted Function: Handle row updates
  const processRowUpdateHandler = (updatedRow: Transaction) => {
    updateTransaction(updatedRow.id, updatedRow);
    return updatedRow; // Return the updated row to DataGrid
  };

  // Abstracted Function: Handle row update errors
  const handleRowUpdateError = (error: any) => {
    console.error("Row update error:", error);
  };

  useEffect(() => {
    const fetchData = async () => {
      const parsedData = await fetchParsedData(fileId);
      setAccount(parsedData.acc);
      setBank(parsedData.bank);

      // Prepare transactions with additional info and a unique 'id'
      const processedTransactions = parsedData.transactions.map(
        (transaction: Transaction, index: number) => {
          const { additionalInfo, ...rest } = transaction;
          return {
            ...rest,
            ...additionalInfo,
            id: index, // Add a unique 'id' for each row
            label: "",
            category: "",
          };
        }
      );

      setTransactions(processedTransactions);
    };

    fetchData();
  }, [fileId]);

  const columns: GridColDef[] = [
    {
      field: "date",
      ...dateColumnType,
      headerName: "Date",
      editable: true,
      width: 110,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: false,
    },
    {
      field: "in",
      headerName: "In",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "out",
      headerName: "Out",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "label",
      headerName: "Label",
      width: 200,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <Select
          value={params.row.category || ""}
          onChange={(e) =>
            updateTransaction(params.row.id, { category: e.target.value })
          }
          size="small"
          fullWidth
        >
          <MenuItem value="Category A">Category A</MenuItem>
          <MenuItem value="Category B">Category B</MenuItem>
          <MenuItem value="Category C">Category C</MenuItem>
        </Select>
      ),
    },
    // Dynamically add additionalInfo columns
    ...(transactions[0]
      ? Object.keys(transactions[0])
          .filter(
            (key) =>
              ![
                "id",
                "_id",
                "date",
                "description",
                "in",
                "out",
                "label",
                "category",
              ].includes(key)
          )
          .map((key) => ({
            field: key,
            headerName: key,
            width: 100,
            editable: true,
          }))
      : []),
  ];

  return (
    <PageContainer>
      <Typography variant="h6" mb={2}>
        Parsed Information
      </Typography>

      <Grid container spacing={2} mb={4} alignItems="center">
        <Grid item xs={5}>
          <TextField
            label="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Bank"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => console.log(transactions)}
          >
            Save
          </Button>
        </Grid>
      </Grid>

      <Box height="70vh" width="100%">
        <DataGrid
          rows={transactions}
          columns={columns.map((col) => ({
            ...col,
            cellClassName: "custom-cell",
          }))}
          processRowUpdate={processRowUpdateHandler}
          onProcessRowUpdateError={handleRowUpdateError}
          pagination
          getRowHeight={() => "auto"}
          sx={{
            "& .custom-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </PageContainer>
  );
};

export default ParsedDataPage;
