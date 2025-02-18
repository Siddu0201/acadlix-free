import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const LastQuestionModel = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const handleClose = () => {
    props?.setLastModel(false);
  }

  return (
    <BootstrapDialog
      open={props?.lastModel}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Box>
          <Typography>
            {props?.message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleClose}>
          {__("Close", "acadlix")}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default LastQuestionModel;
