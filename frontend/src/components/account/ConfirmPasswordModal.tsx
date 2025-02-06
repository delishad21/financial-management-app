import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export const ConfirmPasswordModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Password</DialogTitle>
    <div className="p-4">Please enter your password to unlock the field.</div>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="primary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);
