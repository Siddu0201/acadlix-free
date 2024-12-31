import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../../../components/CustomTextField";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff, IoClose } from "../../../../../../helpers/icons";
import { PostUserLogin } from "../../../../../../requests/front/FrontUserRequest";
import parse from "html-react-parser";

const SignIn = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const methods = useForm({
    defaultValues: {
      user_login: "",
      user_password: "",
      remember: false,
      error: "",
    },
  });

  const loginMutation = PostUserLogin();

  const handleLogin = (data) => {
    loginMutation?.mutate(data, {
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
        Login
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
              label="Username or Email Address"
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
              {...methods.register("user_password", {
                required: "Required",
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
            <FormControlLabel
              label="Remember me"
              control={<Checkbox />}
              checked={methods.watch("remember")}
              onChange={(e) => {
                methods.setValue("remember", e?.target?.checked, {
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Link
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                props?.setValue("signin", false, { shouldDirty: true });
                props?.setValue("signup", true, { shouldDirty: true });
              }}
            >
              Register
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
          onClick={methods?.handleSubmit(handleLogin)}
          disabled={loginMutation?.isPending}
        >
          {loginMutation?.isPending ? "...loading" : "Login"}
        </Button>
      </DialogActions>
    </>
  );
};

export default SignIn;
