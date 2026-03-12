import { Box, Dialog, DialogContent, IconButton, styled, useTheme } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form'
import Login from './modal/Login';
import Register from './modal/Register';
import ForgotPassword from './modal/ForgotPassword';
import PropTypes from 'prop-types';
import { IoClose } from '@acadlix/helpers/icons';
import { DynamicMUIRenderer } from '../extensions/muiRecursiveRenderer';

const UserAuth = ({
  isModal = true,
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
  const theme = useTheme();
  const methods = useForm({
    defaultValues: {
      users_can_register: Boolean(Number(users_can_register)),
      login_modal_type: acadlixOptions.settings.acadlix_default_auth_screen ?? "login", // login/register/forgot-password
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

  React.useEffect(() => {
    if (acadlixOptions.isReCaptchaEnabled) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${acadlixOptions.settings.acadlix_v3_site_key}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isModal) {
    return (
      <Box
        sx={{
          width: "100%",
        }}
      >
        <LoginContent
          methods={methods}
          isModal={isModal}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessLogin={onSuccessLogin}
          onSuccessRegister={onSuccessRegister}
          onSuccessForgotPassword={onSuccessForgotPassword}
        />
      </Box>
    );
  }

  return (
    <BootstrapDialog
      open={login_modal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
    >
      <IconButton
        className='acadlix-icon-btn'
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          boxShadow: "none",
        }}
      >
        <IoClose style={{
          fontSize: 20
        }} />
      </IconButton>
      <DialogContent
        sx={{
          paddingX: {
            xs: `${theme.spacing(4)} !important`,
            sm: `${theme.spacing(8)} !important`,
          },
          paddingY: `${theme.spacing(8)} !important`,
        }}
      >

        <LoginContent
          methods={methods}
          isModal={isModal}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessLogin={onSuccessLogin}
          onSuccessRegister={onSuccessRegister}
          onSuccessForgotPassword={onSuccessForgotPassword}
        />
      </DialogContent>
    </BootstrapDialog>
  )
}

const LoginContent = ({
  methods,
  isModal,
  ajax_url,
  nonce,
  handleClose,
  onSuccessLogin,
  onSuccessRegister,
  onSuccessForgotPassword,
}) => {

  const defaultSetting = {
    component: "Fragment",
    component_name: "login_content_fragment",
    children: [
      methods?.watch("login_modal_type") === "login" && ({
        component: <Login
          {...methods}
          isModal={isModal}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessLogin={onSuccessLogin}
        />,
        component_name: "login_component",
      }),
      methods?.watch("login_modal_type") === "register" && ({
        component: <Register
          {...methods}
          isModal={isModal}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessRegister={onSuccessRegister}
        />,
        component_name: "register_component",
      }),
      methods?.watch("login_modal_type") === "forgot-password" && ({
        component: <ForgotPassword
          {...methods}
          isModal={isModal}
          ajax_url={ajax_url}
          nonce={nonce}
          handleClose={handleClose}
          onSuccessForgotPassword={onSuccessForgotPassword}
        />,
        component_name: "forgot_password_component",
      })
    ]
  }

  const settings = window?.acadlixHooks?.applyFilters?.(
    'acadlix.front.user_auth.modal.settings',
    [defaultSetting],
    {
      methods,
      isModal,
      ajax_url,
      nonce,
      handleClose,
      onSuccessLogin,
      onSuccessRegister,
      onSuccessForgotPassword,
    }
  );

  return (
    <>
      {settings?.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              control: methods?.control,
              watch: methods?.watch,
              setValue: methods?.setValue,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
  // return (
  //   <React.Fragment>
  //     {methods?.watch("login_modal_type") === "login" && (
  //       <Login
  //         {...methods}
  //         isModal={isModal}
  //         ajax_url={ajax_url}
  //         nonce={nonce}
  //         handleClose={handleClose}
  //         onSuccessLogin={onSuccessLogin}
  //       />
  //     )}
  //     {methods?.watch("login_modal_type") === "register" && (
  //       <Register
  //         {...methods}
  //         isModal={isModal}
  //         ajax_url={ajax_url}
  //         nonce={nonce}
  //         handleClose={handleClose}
  //         onSuccessRegister={onSuccessRegister}
  //       />
  //     )}
  //     {methods?.watch("login_modal_type") === "forgot-password" && (
  //       <ForgotPassword
  //         {...methods}
  //         isModal={isModal}
  //         ajax_url={ajax_url}
  //         nonce={nonce}
  //         handleClose={handleClose}
  //         onSuccessForgotPassword={onSuccessForgotPassword}
  //       />
  //     )}
  //   </React.Fragment>
  // )
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
