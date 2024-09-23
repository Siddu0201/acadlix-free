import { Dialog } from "@mui/material";
import React from "react";

const BootstrapDialog = (props) => {
  return (
    <Dialog
      {...props}
      open={props?.open}
      onClose={props?.onClose}
      sx={{
        "& .MuiDialogContent-root": {
          padding: 2,
        },
        "& .MuiDialogActions-root": {
          padding: 2,
        },
        "& .MuiPaper-root": {
          width: "100%",
        },
      }}
    >
      {props?.children}
    </Dialog>
  );
};

export default BootstrapDialog;
