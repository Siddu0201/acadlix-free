import {
  Box,
  Checkbox,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "../../../helpers/icons";
import CustomTextField from "../../../components/CustomTextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

const Login = (props) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    username: "",
    password: "",
    rememberme: false,
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
        } else {
          setIsLoading(false);
          toast.error(res?.data?.data?.message);
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
        paddingY: `${theme.spacing(8)} !important`,
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 4
        }}>
          <Box>
            <Typography variant="h5">Welcome back</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Please enter your detail to sign in.</Typography>
          </Box>
        </Box>
        <Divider sx={{
          marginBottom: 4
        }} />
        <form onSubmit={methods?.handleSubmit(handleSubmit)}>
          <Grid container gap={3}>
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
                        sx={{
                          boxShadow: "none",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(methods?.formState?.errors?.password)}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                label="Remember me"
                checked={methods?.watch("rememberme")}
                onClick={(e) => {
                  methods?.setValue("rememberme", !methods?.watch("rememberme"), { shouldDirty: true });
                }}
                control={<Checkbox />}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <LoadingButton
                loading={isLoading}
                fullWidth
                variant="contained"
                type="submit"
              >
                Login
              </LoadingButton>
            </Grid>
            {
              props?.watch("users_can_register") &&
              <Grid item xs={12} lg={12} sx={{
                display: "flex",
                justifyContent: "center"
              }}>
                <Typography variant="body2">
                  Don't have account yet? {" "}
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
        </form>
      </DialogContent>
    </>
  );
};

export default Login;
