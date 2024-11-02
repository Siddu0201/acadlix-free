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
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import CustomTextField from "../../../components/CustomTextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Login = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    username: "",
    password: "",
  });

  const handleSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(
        acadlixOptions?.ajax_url,
        new URLSearchParams({
          action: "acadlix_login",
          nonce: acadlixOptions?.nonce,
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
        toast.error("Opps! Something went wrong.");
        console.error(err);
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
        <Grid container gap={4}>
          <Grid item xs={12} lg={12}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                paddingY: 1,
              }}
            >
              Username/Email <span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              {...methods?.register("username", { required: true })}
              fullWidth
              required
              autoComplete="username"
              autoCapitalize="off"
              size="small"
              type="text"
              name="username"
              placeholder="Username/email"
              value={methods?.watch("username")}
              onChange={(e) => {
                methods?.setValue("username", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.username)}
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
              {...methods?.register("password", { required: true })}
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
            />
          </Grid>
          {
            props?.watch("users_can_register") &&
            <Grid item xs={12} lg={12}>
              <Typography variant="body2">
                <Link
                  href="#"
                  onClick={(e) => {
                    e?.preventDefault();
                    props?.setValue("login_modal_type", "register", {
                      shouldDirty: true,
                    });
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Grid>
          }
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
          {isLoading ? <CircularProgress color="inherit" size={20} /> : "Login"}
        </Button>
      </DialogActions>
    </>
  );
};

export default Login;
