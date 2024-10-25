import React, { FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setForgotEmail: (email: string) => void;
  loading?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    padding: theme.spacing(2),
    maxWidth: '450px',
    width: '100%'
  }
}));

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 8px',
});

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
  onSubmit,
  setForgotEmail,
  loading = false
}) => {

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <StyledDialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <StyledDialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <MailOutlineIcon color="primary" />
            <Typography variant="h6" component="span">
              Forgot Password
            </Typography>
          </Box>
          {!loading && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </StyledDialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your email to receive a password recovery link.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              }
            }}
            inputProps={{
              'aria-label': 'Email for password recovery.',
              'data-testid': 'forgot-password-email-input'
            }}
          />
        </DialogContent>

        <DialogActions sx={{ 
          padding: 2, 
          justifyContent: 'space-between',
          gap: 2
        }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            data-testid="forgot-password-cancel-button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              minWidth: 120,
              position: 'relative'
            }}
            data-testid="forgot-password-submit-button"
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-12px'
                  }}
                />
                <span style={{ visibility: 'hidden' }}>Send</span>
              </>
            ) : (
              'Send link'
            )}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default ForgotPasswordModal;