import {
  Alert,
  Box,
  Button,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { IoClose, MdVisibility, MdVisibilityOff } from "@acadlix/helpers/icons";
import CustomTextField from "@acadlix/components/CustomTextField";
import { useForm } from "react-hook-form";
import axios from "axios";
import { RawHTML } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const Register = (props) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      error: "",
    }
  });

  const handleSubmit = (data) => {
    methods?.setValue("error", "", { shouldDirty: true });
    setIsLoading(true);
    axios
      .post(
        props?.ajax_url,
        new URLSearchParams({
          action: "acadlix_register",
          nonce: props?.nonce,
          ...data,
        })
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.data?.success) {
          if (props?.onSuccessRegister) {
            props?.onSuccessRegister(res?.data?.data);
          } else {
            window.location.reload();
          }
        } else {
          methods?.setValue("error", res?.data?.data?.message, { shouldDirty: true });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        methods?.setValue("error", __("Opps!Something went wrong.", 'acadlix'), { shouldDirty: true });
        console.error(err);
      });
  };

  return (
    <>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
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

      <DialogContent sx={{
        paddingX: {
          xs: `${theme.spacing(4)} !important`,
          sm: `${theme.spacing(8)} !important`,
        },
        paddingY: {
          xs: `${theme.spacing(8)} !important`,
          sm: `${theme.spacing(4)} !important`
        },
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: {
            xs: 4,
            sm: 2,
          }
        }}>
          <Box>
            <Typography variant="h5">{__('Welcome Back', 'acadlix')}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">{__('Please enter your details to sign up.', 'acadlix')}</Typography>
          </Box>
          {
            methods?.watch("error") &&
            <Alert severity="error" sx={{
              alignItems: "center"
            }}>
              <RawHTML>{methods?.watch("error")}</RawHTML>
            </Alert>
          }
        </Box>
        <Divider sx={{
          marginBottom: {
            xs: 4,
            sm: 2,
          }
        }} />
        <form onSubmit={methods?.handleSubmit(handleSubmit)}>
          <Grid container gap={{ xs: 3, sm: 2 }}>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Username', 'acadlix')} <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomTextField
                {...methods?.register("username", { required: __('Username is required', 'acadlix') })}
                fullWidth
                required
                autoComplete="username"
                autoCapitalize="off"
                size="small"
                type="text"
                name="username"
                placeholder={__("Username", 'acadlix')}
                value={methods?.watch("username")}
                onChange={(e) => {
                  methods?.setValue("username", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                error={Boolean(methods?.formState?.errors?.username)}
                helperText={methods?.formState?.errors?.username?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Email', 'acadlix')} <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomTextField
                {...methods?.register("email", { required: __('Email is required', 'acadlix') })}
                fullWidth
                required
                autoComplete="email"
                autoCapitalize="off"
                size="small"
                type="text"
                name="email"
                placeholder={__("Email", 'acadlix')}
                value={methods?.watch("email")}
                onChange={(e) => {
                  methods?.setValue("email", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                error={Boolean(methods?.formState?.errors?.email)}
                helperText={methods?.formState?.errors?.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Password', 'acadlix')} <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomTextField
                {...methods?.register("password", {
                  required: __('Password is required', 'acadlix'),
                  minLength: {
                    value: 8,
                    message: __('Password must have at least 8 characters', 'acadlix')
                  },
                })}
                fullWidth
                required
                autoComplete="password"
                autoCapitalize="off"
                size="small"
                name="password"
                placeholder={__("Password", 'acadlix')}
                value={methods?.watch("password")}
                onChange={(e) => {
                  methods?.setValue("password", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e?.preventDefault()}
                        edge="end"
                        sx={{
                          boxShadow: "none",
                        }}
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(methods?.formState?.errors?.password)}
                helperText={methods?.formState?.errors?.password?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Confirm Password', 'acadlix')} <span style={{ color: "red" }}>*</span>
              </Typography>
              <CustomTextField
                {...methods?.register("confirm_password", {
                  required: __('Confirm password is required', 'acadlix'),
                  minLength: {
                    value: 8,
                    message: __('Confirm password must have at least 8 characters', 'acadlix')
                  },
                  validate: (val) => {
                    if (methods?.watch("password") != val) {
                      return __('Your passwords do no match', 'acadlix');
                    }
                  },
                })}
                fullWidth
                required
                autoComplete="confirm_password"
                autoCapitalize="off"
                size="small"
                name="confirm_password"
                placeholder={__("Confirm Password", 'acadlix')}
                value={methods?.watch("confirm_password")}
                onChange={(e) => {
                  methods?.setValue("confirm_password", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                type={showConfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e?.preventDefault()}
                        edge="end"
                        sx={{
                          boxShadow: "none",
                        }}
                      >
                        {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(methods?.formState?.errors?.confirm_password)}
                helperText={methods?.formState?.errors?.confirm_password?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Button
                loading={isLoading}
                fullWidth
                variant="contained"
                type="submit"
              >
                {__('Register', 'acadlix')}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }} sx={{
              display: "flex",
              justifyContent: "center"
            }}>
              <Typography variant="body2">
                {__("Already have account?", 'acadlix')} {" "}
                <Link
                  href="#"
                  onClick={(e) => {
                    e?.preventDefault();
                    props?.setValue("login_modal_type", "login", {
                      shouldDirty: true,
                    });
                  }}
                >
                  {__('Login', 'acadlix')}
                </Link>
                {" | "}
                <Link
                  href="#"
                  onClick={(e) => {
                    e?.preventDefault();
                    props?.setValue("login_modal_type", "forgot-password", {
                      shouldDirty: true,
                    });
                  }}
                >
                  {__('Lost your password?', 'acadlix')}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </>
  );
};

export default Register;
