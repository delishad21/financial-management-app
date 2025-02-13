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
  onConfirm: (password: string) => void;
}> = ({ open, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
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
        />
        <Box>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => onConfirm(password)} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};
