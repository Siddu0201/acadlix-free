import { Dialog } from "@mui/material";
import React from "react";

const BootstrapDialog = ({
  xs = "100%",
  sm = "70%",
  md = "60%",
  xl = "100%",
  ...props
}) => {
  return (
    <Dialog
      {...props}
      open={props?.open}
      onClose={props?.onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          width: {
            xs: xs,
            sm: sm,
            md: md,
            xl: xl,
          },
          height: {
            xs: "auto", // 70% height on small screens
            sm: "auto", // 60% height on medium screens
            md: "auto",
            xl: "auto", // 50% height on larger screens
          },
          margin: 4,
        },
      }}
      sx={{
        "& .MuiDialogContent-root": {
          padding: 2,
          maxHeight: {
            xs: "450px",
            sm: "350px",
            md: "350px",
            xl: "450px",
          },
        },
        "& .MuiDialogActions-root": {
          padding: 2,
        },
      }}
    >
      {props?.children}
    </Dialog>
  );
};

export default BootstrapDialog;
