"use client";

import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ConfirmPasswordModal } from "./ConfirmPasswordModal";

export const AccModificationView: React.FC<{
  username: string;
  email: string;
}> = ({ username, email }) => {
  // State for each field
  const [usernameValue, setUsernameValue] = useState(username);
  const [emailValue, setEmailValue] = useState(email);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [editableField, setEditableField] = useState<string | null>(null);
  const [confirmEditableField, setConfirmEditableField] = useState<
    string | null
  >(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Handle input change for each field
  const handleChange = (field: string, value: string) => {
    if (field === "username") setUsernameValue(value);
    if (field === "email") setEmailValue(value);
    if (field === "password") setPasswordValue(value);
    if (field === "confirmPassword") setConfirmPasswordValue(value);
  };

  // Handle submit or confirm button
  const handleConfirm = (field: string) => {
    if (field === "username") {
      // validate username
      // change username
    }

    if (field === "email") {
      // validate email
      // change email
    }

    if (field === "password") {
      // validate password
      // change password
    }

    const isUpdateSuccessful = true; // Assume success for this example

    if (isUpdateSuccessful) {
      setFeedbackMessage("Update successful!");
    } else {
      setFeedbackMessage("Update failed!");
    }
  };

  // Handle click to edit field
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
        <Grid container key={field} spacing={1} alignItems="center">
          <Grid item xs={6}>
            <TextField
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={
                field === "username"
                  ? usernameValue
                  : field === "email"
                  ? emailValue
                  : field === "password"
                  ? passwordValue
                  : ""
              }
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={field === "password" ? "••••••••" : ""}
              type={field === "password" ? "password" : "text"}
              disabled={confirmEditableField !== field}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            {confirmEditableField !== field ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditClick(field)}
                fullWidth
                style={{ height: "48px" }}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                fullWidth
                style={{ height: "48px" }}
                onClick={() => handleConfirm(field)}
              >
                Confirm
              </Button>
            )}
          </Grid>
        </Grid>
      ))}

      {confirmEditableField === "password" && (
        <Grid container key="confirmPassword" spacing={1} alignItems="center">
          <Grid item xs={6}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPasswordValue}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              type="password"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* Feedback message */}
      {feedbackMessage && (
        <Typography
          color={feedbackMessage === "Update successful!" ? "success" : "error"}
          variant="body2"
          pt={1}
        >
          {feedbackMessage}
        </Typography>
      )}

      <ConfirmPasswordModal
        open={editableField !== null}
        onClose={() => setEditableField(null)}
        onConfirm={handleConfirmPassword}
      />
    </Stack>
  );
};
