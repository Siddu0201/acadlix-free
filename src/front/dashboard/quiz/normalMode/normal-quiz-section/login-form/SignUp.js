import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import React from "react";
import { PostUserRegister } from "../../../../../../requests/front/FrontUserRequest";
import CustomTextField from "../../../../../../components/CustomTextField";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import parse from "html-react-parser"

const SignUp = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const methods = useForm({
    defaultValues: {
      user_login: "",
      user_email: "",
      user_password: "",
      confirm_password: "",
      error: "",
    },
  });

  const registerMutation = PostUserRegister();

  const handleRegister = (data) => {
    registerMutation?.mutate(data, {
        onSuccess: (data) => {
          console.log(data);
          if (data?.data?.error) {
            methods?.setValue("error", data?.data?.error, { shouldDirty: true });
          } else {
            if (data?.data?.user?.data) {
              props?.setValue("user_id", Number(data?.data?.user?.data?.ID), {
                shouldDirty: true,
              });
              props?.setValue("name", data?.data?.user?.data?.display_name, {
                shouldDirty: true,
              });
              props?.setValue("email", data?.data?.user?.data?.user_email, {
                shouldDirty: true,
              });
              props?.setValue("login_model", false, { shouldDirty: true });
              if (props?.watch("prerequisite") || props?.watch("per_user_allowed_attempt") > 0) {
                props?.handleStartWithPrerequisite();
              } else {
                props?.handleStart();
              }
            }
          }
        },
      });
  };
  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        Register
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent>
        {methods?.watch("error") && (
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Alert severity="error">{parse(methods?.watch("error"))}</Alert>
          </Box>
        )}
        <Grid container gap={4}>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              {...methods.register("user_login", {
                required: "Required",
              })}
              required
              fullWidth
              label="Username"
              size="small"
              type="text"
              value={methods?.watch("user_login")}
              onChange={(e) => {
                methods?.setValue("user_login", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.user_login)}
              helperText={methods?.formState?.errors?.user_login?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              {...methods.register("user_email", {
                required: "Required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              required
              fullWidth
              label="Email"
              size="small"
              type="text"
              value={methods?.watch("user_email")}
              onChange={(e) => {
                methods?.setValue("user_email", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.user_email)}
              helperText={methods?.formState?.errors?.user_email?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              {...methods.register("user_password", {
                required: "Required",
                minLength: {
                  value: 8,
                  message: "min length is 8",
                },
              })}
              required
              fullWidth
              label="Enter your password"
              size="small"
              type={showPassword ? "text" : "password"}
              value={methods?.watch("user_password")}
              onChange={(e) => {
                methods?.setValue("user_password", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      sx={{
                        marginBottom: "0 !important",
                      }}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(methods?.formState?.errors?.user_password)}
              helperText={methods?.formState?.errors?.user_password?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              {...methods.register("confirm_password", {
                required: "Required",
                minLength: {
                  value: 8,
                  message: "min length is 8",
                },
                validate: (val) => {
                  if (methods?.watch("user_password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              required
              fullWidth
              label="Enter your confim password"
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              value={methods?.watch("confirm_password")}
              onChange={(e) => {
                methods?.setValue("confirm_password", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      sx={{
                        marginBottom: "0 !important",
                      }}
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(methods?.formState?.errors?.confirm_password)}
              helperText={methods?.formState?.errors?.confirm_password?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Link
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                props?.setValue("signup", false, { shouldDirty: true });
                props?.setValue("signin", true, { shouldDirty: true });
              }}
            >
              Login
            </Link>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={methods?.handleSubmit(handleRegister)}
          disabled={registerMutation?.isPending}
        >
          {registerMutation?.isPending ? "...loading" : "Register"}
        </Button>
      </DialogActions>
    </>
  );
};

export default SignUp;
