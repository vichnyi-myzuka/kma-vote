import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export type ConfirmationDialogOpenHandlerProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type ConfirmationDialogHandle = {
  open: ({
    title,
    message,
    onCancel,
    onConfirm,
  }: ConfirmationDialogOpenHandlerProps) => void;
};

// eslint-disable-next-line react/display-name
const ConfirmationDialog = forwardRef<ConfirmationDialogHandle>(
  (props, ref) => {
    const [open, setOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
    const [onCancel, setOnCancel] = useState<() => void>(() => () => {});
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const handleClose = () => {
      setOpen(false);
      onCancel?.();
    };

    const handleConfirm = () => {
      setOpen(false);
      onConfirm?.();
    };

    const handleOpen = ({
      title,
      message,
      onCancel,
      onConfirm,
    }: ConfirmationDialogOpenHandlerProps) => {
      setOpen(true);
      setOnConfirm(() => onConfirm);
      setOnCancel(() => onCancel ?? (() => {}));
      setTitle(title);
      setMessage(message);
    };

    useImperativeHandle(ref, () => ({
      open: handleOpen,
    }));

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ні</Button>
          <Button onClick={handleConfirm} autoFocus>
            Так
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

export default ConfirmationDialog;
