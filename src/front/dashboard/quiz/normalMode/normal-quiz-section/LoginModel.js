import {
  Dialog,
  styled,
} from "@mui/material";
import React from "react";
import SignIn from "./login-form/SignIn";
import SignUp from "./login-form/SignUp";

const LoginModel = (props) => {
  const handleClose = () => {
    props?.setValue("login_model", false, { shouldDirty: true });
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  return (
    <>
      <BootstrapDialog
        open={props?.watch("login_model")}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {props?.watch("signin") && (
          <SignIn {...props} handleClose={handleClose} />
        )}
        {props?.watch("signup") && (
          <SignUp {...props} handleClose={handleClose} />
        )}
      </BootstrapDialog>
    </>
  );
};

export default LoginModel;
