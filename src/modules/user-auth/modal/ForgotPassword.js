import { Alert, Box, DialogContent, Divider, Grid, IconButton, Link, Typography, useTheme } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { IoClose } from '../../../helpers/icons';
import CustomTextField from '../../../components/CustomTextField';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { RawHTML } from '@wordpress/element';

const ForgotPassword = (props) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = React.useState(false);
    const methods = useForm({
        defaultValues: {
            username: "",
            submit: false,
            error: "",
        }
    });

    const handleSubmit = (data) => {
        methods?.setValue("error", "", { shouldDirty: true });
        setIsLoading(true);
        axios.post(
            props?.ajax_url,
            new URLSearchParams({
                action: "acadlix_forgot_password",
                nonce: props?.nonce,
                ...data
            }))
            .then((res) => {
                setIsLoading(false);
                if (res?.data?.success) {
                    methods?.setValue("submit", true, { shouldDirty: true });
                    if(props?.onSuccessForgotPassword){
                        props?.onSuccessForgotPassword(res?.data?.data);
                    }
                } else {
                    methods?.setValue("error", res?.data?.data?.message, { shouldDirty: true });
                }
            })
            .catch((err) => {
                setIsLoading(false);
                methods?.setValue("error", "Opps! Something went wrong.", { shouldDirty: true });
                console.error(err);
            });
    }
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
                    gap: 2,
                    alignItems: "center",
                    marginBottom: 4
                }}>
                    <Alert severity="info" sx={{
                        alignItems: "center"
                    }}>
                        Please enter your username or email address. You will receive an email message with instructions on how to reset your password.
                    </Alert>
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
                    marginBottom: 4
                }} />
                <form onSubmit={methods?.handleSubmit(handleSubmit)}>
                    <Grid container gap={3}>
                        {
                            !methods?.watch("submit") ?
                                <>
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
                                        <LoadingButton
                                            loading={isLoading}
                                            fullWidth
                                            variant="contained"
                                            type="submit"
                                        >
                                            Get New Password
                                        </LoadingButton>
                                    </Grid>
                                </>
                                :
                                <Grid item xs={12} lg={12}>
                                    <Alert severity="success">
                                        Check your email for the confirmation link, then visit the login page.
                                    </Alert>
                                </Grid>
                        }
                        <Grid item xs={12} lg={12} sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
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

                                {props?.watch("users_can_register") &&
                                    <>
                                        &nbsp;|&nbsp;
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
                                    </>
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </>
    )
}

export default ForgotPassword
