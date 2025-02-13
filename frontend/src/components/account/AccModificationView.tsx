import { Button, Grid, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { ConfirmPasswordModal } from "./ConfirmPasswordModal";

export const AccModificationView: React.FC<{
  username: string;
  email: string;
}> = ({ username, email }) => {
  const [editableField, setEditableField] = useState<string | null>(null);
  const [confirmEditableField, setConfirmEditableField] = useState<
    string | null
  >(null);

  const handleEditClick = (field: string) => {
    setEditableField(field);
  };

  const handleConfirmPassword = () => {
    setEditableField(null);
    setConfirmEditableField(editableField);
  };

  return (
    <Stack spacing={2} direction="column">
      {["username", "email", "password"].map((field) => (
        <Grid
          container
          key={field}
          spacing={1}
          alignItems={"center"}
          direction={"row"}
        >
          <Grid item xs={6}>
            <TextField
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              defaultValue={field === "username" ? username : email}
              type={field === "password" ? "password" : "text"}
              disabled={editableField !== field}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color={confirmEditableField === field ? "success" : "primary"}
              onClick={() => handleEditClick(field)}
              fullWidth
              style={{ height: "48px" }}
            >
              {confirmEditableField === field ? "Confirm" : "Edit"}
            </Button>
          </Grid>
        </Grid>
      ))}

      <ConfirmPasswordModal
        open={editableField !== null}
        onClose={() => setEditableField(null)}
        onConfirm={handleConfirmPassword}
      />
    </Stack>
  );
};
