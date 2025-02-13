import { verifyPassword } from "@/services/user/actions";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const ConfirmPasswordModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setPassword("");
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      const response = await verifyPassword(password);
      if (response.status != "success") {
        throw new Error(response.message);
      }
      onConfirm();
      handleClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <Box p={2}>
        <Typography variant="h6" mb={2} mt={1}>
          Confirm action
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          This field is sensitive and requires your password to unlock.
        </Typography>
        <TextField
          label="Password"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        />
        {error && (
          <Typography variant="body2" color="error" mt={0.5} ml={0.5}>
            {error}
          </Typography>
        )}
        <Box>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};
