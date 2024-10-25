import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import CustomTextField from "../../../components/CustomTextField";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";

const Register = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(
        acadlixOptions?.ajax_url,
        new URLSearchParams({
          action: "acadlix_register",
          ...data,
        })
      )
      .then((res) => {
        if (res?.data?.success) {
          setIsLoading(false);
          window.location.reload();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Opps!Something went wrong.");
        console.error(err);
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
        <Grid container gap={4}>
          <Grid item xs={12} lg={12}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                paddingY: 1,
              }}
            >
              Username <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              {...methods?.register("username", { required: "Username is required" })}
              fullWidth
              required
              autoComplete="username"
              autoCapitalize="off"
              size="small"
              type="text"
              name="username"
              placeholder="Username"
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
          <Grid item xs={12} lg={12}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                paddingY: 1,
              }}
            >
              Email <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              {...methods?.register("email", { required: "Email is required" })}
              fullWidth
              required
              autoComplete="email"
              autoCapitalize="off"
              size="small"
              type="text"
              name="email"
              placeholder="Email"
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
          <Grid item xs={12} lg={12}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                paddingY: 1,
              }}
            >
              Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              {...methods?.register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
              fullWidth
              required
              autoComplete="password"
              autoCapitalize="off"
              size="small"
              name="password"
              placeholder="Password"
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(methods?.formState?.errors?.password)}
              helperText={methods?.formState?.errors?.password?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                paddingY: 1,
              }}
            >
              Confirm Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              {...methods?.register("confirm_password", {
                required: "Confirm password is required",
                minLength: {
                  value: 8,
                  message: "Confirm password must have at least 8 characters",
                },
                validate: (val) => {
                  if (methods?.watch("password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              fullWidth
              required
              autoComplete="confirm_password"
              autoCapitalize="off"
              size="small"
              name="confirm_password"
              placeholder="Confirm Password"
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
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(methods?.formState?.errors?.confirm_password)}
              helperText={methods?.formState?.errors?.confirm_password?.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Typography variant="body2">
              <Link
                href="#"
                onClick={(e) => {
                  e?.preventDefault();
                  props?.setValue("login_modal_type", "login", {
                    shouldDirty: true,
                  });
                }}
              >
                Login
              </Link>
            </Typography>
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
          onClick={methods?.handleSubmit(handleSubmit)}
        >
          {isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Register"
          )}
        </Button>
      </DialogActions>
    </>
  );
};

export default Register;
