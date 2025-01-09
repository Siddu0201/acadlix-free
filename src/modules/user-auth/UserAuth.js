import { Dialog, styled } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form'
import Login from './modal/Login';
import Register from './modal/Register';
import ForgotPassword from './modal/ForgotPassword';
import PropTypes from 'prop-types';

const UserAuth = ({
  login_modal = false,
  users_can_register = false,
  maxWidth = "xs",
  ajax_url = "",
  nonce = "",
  handleClose = null,
  onSuccessLogin = null,
  onSuccessRegister = null,
  onSuccessForgotPassword = null,
}) => {
  const methods = useForm({
    defaultValues: {
      users_can_register: Boolean(Number(users_can_register)),
      login_modal_type: "login", // login/register/forgot-password
    }
  });

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "100%",
    },
  }));


  return (
    <BootstrapDialog
      open={login_modal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
    >
      {methods?.watch("login_modal_type") === "login" && (
        <Login
          {...methods}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessLogin={onSuccessLogin}
        />
      )}
      {methods?.watch("login_modal_type") === "register" && (
        <Register
          {...methods}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessRegister={onSuccessRegister}
        />
      )}
      {methods?.watch("login_modal_type") === "forgot-password" && (
        <ForgotPassword
          {...methods}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessForgotPassword={onSuccessForgotPassword}
        />
      )}
    </BootstrapDialog>
  )
}

UserAuth.propTypes = {
  login_modal: PropTypes.bool,
  users_can_register: PropTypes.bool,
  maxWidth: PropTypes.string,
  ajax_url: PropTypes.string.isRequired,
  nonce: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccessLogin: PropTypes.func,
  onSuccessRegister: PropTypes.func,
  onSuccessForgotPassword: PropTypes.func,
};

export default UserAuth
