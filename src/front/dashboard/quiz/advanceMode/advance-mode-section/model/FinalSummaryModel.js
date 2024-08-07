import { Dialog, styled } from "@mui/material";
import React from "react";

const FinalSummaryModel = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  return (
    <BootstrapDialog
      open={props?.open}
      onClose={props?.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    ></BootstrapDialog>
  );
};

export default FinalSummaryModel;
