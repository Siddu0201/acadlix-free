import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const Login = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      rememberme: false,
      error: "",
      error_code: "",
    },
  });

  const handleSubmit = async (data) => {
    methods?.setValue("error", "", { shouldDirty: true });
    setIsLoading(true);
    if (acadlixOptions.isReCaptchaEnabled) {
      const response = await window.grecaptcha.execute(acadlixOptions.settings.acadlix_v3_site_key, { action: 'acadlix_login' });
      data['g-recaptcha-response'] = response;
    }
    axios
      .post(
        props?.ajax_url,
        new URLSearchParams({
          action: "acadlix_login",
          nonce: props?.nonce,
          ...data,
        })
      )
      .then((res) => {
        setIsLoading(false);
        // Allow hooks to handle the response and control whether to continue
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.login.response', true, res, props);

        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
        if (res?.data?.success) {
          if (props?.onSuccessLogin) {
            props?.onSuccessLogin(res?.data?.data);
          } else {
            window.location.reload();
          }
        } else {
          methods?.setValue("error_code", res?.data?.data?.error_code ?? "", { shouldDirty: true });
          methods?.setValue("error", res?.data?.data?.message, { shouldDirty: true });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.login.error', true, err, props);
        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
        methods?.setValue("error", __("Opps! Something went wrong.", 'acadlix'), { shouldDirty: true });
        console.error(err);
      });
  };

  const defaultSetting = {
    component: "Fragment",
    component_name: "login_modal_fragment",

    children: [
      {
        component: "Box",
        component_name: "login_modal_header_box",
        props: {
          sx: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 4
          }
        },
        children: [
          {
            component: "Box",
            component_name: "login_modal_welcome_box",
            children: [
              {
                component: "Typography",
                component_name: "login_modal_welcome_typography",
                props: {
                  variant: "h4",
                },
                value: __("Welcome Back", "acadlix")
              }
            ]
          },
          {
            component: "Box",
            component_name: "login_modal_signin_box",
            children: [
              {
                component: "Typography",
                component_name: "login_modal_signin_typography",
                props: {
                  variant: "body2",
                },
                value: __("Please enter your details to sign in.", "acadlix")
              }
            ]
          },
          {
            component: "Alert",
            component_name: "login_modal_error_alert",
            props: {
              severity: "error",
              sx: {
                display: methods?.watch("error") ? "flex" : "none",
                alignItems: "center",
              },
            },
            children: [
              methods?.watch("error_code") && methods?.watch("error_code") === "incorrect_password" ?
                ({
                  component: "Fragment",
                  component_name: "login_modal_incorrect_password_fragment",
                  children: [
                    {
                      component: "span",
                      component_name: "login_modal_incorrect_password_span",
                      children: [
                        {
                          component: "strong",
                          component_name: "login_modal_error_strong",
                          value: __("Error: ", "acadlix")
                        },
                        {
                          component: "span",
                          component_name: "login_modal_error_span",
                          value: __("The password you entered for the username ", "acadlix")
                        },
                        {
                          component: "strong",
                          component_name: "login_modal_username_strong",
                          value: methods?.watch("username")
                        },
                        {
                          component: "span",
                          component_name: "login_modal_is_incorrect_span",
                          value: __(" is incorrect.", "acadlix")
                        },
                      ]
                    },
                    {
                      component: "Link",
                      component_name: "login_modal_forgot_password_link",
                      props: {
                        href: "#",
                        onClick: (e) => {
                          e?.preventDefault();
                          props?.setValue("login_modal_type", "forgot-password", {
                            shouldDirty: true,
                          });
                        }
                      },
                      value: __("Lost your password?", "acadlix")
                    }
                  ]
                }) :
                ({
                  component: "RawHTML",
                  component_name: "login_modal_error_rawhtml",
                  value: methods?.watch("error")
                })
            ]
          }
        ]
      },
      {
        component: "Divider",
        component_name: "login_modal_divider",
        props: {
          sx: {
            mb: 4
          }
        }
      },
      {
        component: "form",
        component_name: "login_modal_form",
        props: {
          onSubmit: methods?.handleSubmit(handleSubmit)
        },
        children: [
          {
            component: "Grid",
            component_name: "login_modal_form_grid_container",
            props: {
              container: true,
              gap: 3
            },
            children: [
              {
                component: "Grid",
                component_name: "login_modal_form_grid_item_username",
                props: {
                  size: {
                    xs: 12,
                    lg: 12
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "login_modal_form_typography_username_label",
                    props: {
                      variant: "body2",
                      sx: {
                        paddingY: 1
                      }
                    },
                    children: [
                      {
                        component: "span",
                        component_name: "login_modal_form_typography_username_label_span",
                        value: __("Username/Email ", "acadlix")
                      },
                      {
                        component: "span",
                        component_name: "login_modal_form_typography_username_label_span_required",
                        props: {
                          style: {
                            color: "red"
                          }
                        },
                        value: "*"
                      }
                    ]
                  },
                  {
                    component: "CustomTextField",
                    component_name: "login_modal_form_username_textfield",
                    props: {
                      ...methods?.register("username", { required: true }),
                      fullWidth: true,
                      required: true,
                      autoComplete: "username",
                      autoCapitalize: "off",
                      size: "small",
                      type: "text",
                      name: "username",
                      placeholder: __("Username/email", "acadlix"),
                      // value: methods?.watch("username"),
                      onChange: (e) => {
                        methods?.setValue("username", e?.target?.value, {
                          shouldDirty: true,
                        });
                      },
                      error: Boolean(methods?.formState?.errors?.username)
                    }
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "login_modal_form_grid_item_password",
                props: {
                  size: {
                    xs: 12,
                    lg: 12
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "login_modal_form_typography_password_label",
                    props: {
                      variant: "body2",
                      sx: {
                        paddingY: 1
                      }
                    },
                    children: [
                      {
                        component: "span",
                        component_name: "login_modal_form_typography_password_label_span",
                        value: __("Password ", "acadlix")
                      },
                      {
                        component: "span",
                        component_name: "login_modal_form_typography_password_label_span_required",
                        props: {
                          style: {
                            color: "red"
                          }
                        },
                        value: "*"
                      }
                    ]
                  },
                  {
                    component: "PasswordTextField",
                    component_name: "login_modal_form_password_textfield",
                    props: {
                      ...methods?.register("password", { required: true }),
                      fullWidth: true,
                      required: true,
                      autoComplete: "password",
                      autoCapitalize: "off",
                      size: "small",
                      name: "password",
                      placeholder: __("Password", "acadlix"),
                      // value: methods?.watch("password"),
                      onChange: (e) => {
                        methods?.setValue("password", e?.target?.value, {
                          shouldDirty: true,
                        });
                      },
                      error: Boolean(methods?.formState?.errors?.password),
                      helperText: methods?.formState?.errors?.password?.message,
                    }
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "login_modal_form_grid_item_rememberme",
                props: {
                  size: {
                    xs: 12,
                    lg: 12
                  }
                },
                children: [
                  {
                    component: "Box",
                    component_name: "login_modal_form_box_rememberme",
                    props: {
                      sx: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "login_modal_form_formcontrollabel_rememberme",
                        props: {
                          label: __("Remember me", "acadlix"),
                          control: {
                            component: "Checkbox",
                            component_name: "login_modal_form_checkbox_rememberme"
                          },
                          checked: methods?.watch("rememberme"),
                          onClick: () => {
                            methods?.setValue("rememberme", !methods?.watch("rememberme"), { shouldDirty: true });
                          }
                        },
                      },
                      {
                        component: "Typography",
                        component_name: "login_modal_form_typography_forgot_password",
                        props: {
                          variant: "body2"
                        },
                        children: [
                          {
                            component: "Link",
                            component_name: "login_modal_form_link_forgot_password",
                            props: {
                              href: "#",
                              onClick: (e) => {
                                e?.preventDefault();
                                props?.setValue("login_modal_type", "forgot-password", {
                                  shouldDirty: true,
                                });
                              },
                              sx: {
                                cursor: "pointer"
                              }
                            },
                            value: __("Lost your password?", "acadlix")
                          }
                        ]
                      }
                    ]
                  },
                ]
              },
              {
                component: "Grid",
                component_name: "login_modal_form_grid_item_login_button",
                props: {
                  size: {
                    xs: 12,
                    lg: 12
                  },
                },
                children: [
                  {
                    component: "Button",
                    component_name: "login_modal_form_button_login",
                    props: {
                      loading: isLoading,
                      fullWidth: true,
                      variant: "contained",
                      type: "submit"
                    },
                    value: __("Login", "acadlix")
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "login_modal_form_grid_item_register_link",
                props: {
                  size: {
                    xs: 12,
                    lg: 12
                  },
                  sx: {
                    display: props?.watch("users_can_register") ? "flex" : "none",
                    justifyContent: "center"
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "login_modal_form_typography_register_text",
                    props: {
                      variant: "body2"
                    },
                    children: [
                      {
                        component: "span",
                        component_name: "login_modal_form_typography_register_text_span",
                        value: __("Don't have account yet? ", "acadlix")
                      },
                      {
                        component: "Link",
                        component_name: "login_modal_form_link_register",
                        props: {
                          href: "#",
                          onClick: (e) => {
                            e?.preventDefault();
                            props?.setValue("login_modal_type", "register", {
                              shouldDirty: true,
                            });
                          }
                        },
                        value: __("Register", "acadlix")
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const loginSettings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.user_auth.login",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
      handleSubmit: methods?.handleSubmit,
      props: props,
    }
  );

  return (
    <>
      {loginSettings?.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              control: methods?.control,
              watch: methods?.watch,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )

  // return (
  //   <>
  //     <IconButton
  //       aria-label="close"
  //       onClick={props?.handleClose}
  //       sx={{
  //         position: "absolute",
  //         right: 8,
  //         top: 8,
  //         color: (theme) => theme.palette.grey[500],
  //         boxShadow: "none",
  //       }}
  //     >
  //       <IoClose style={{
  //         fontSize: 20
  //       }} />
  //     </IconButton>
  //     <DialogContent sx={{
  //       paddingX: {
  //         xs: `${theme.spacing(4)} !important`,
  //         sm: `${theme.spacing(8)} !important`,
  //       },
  //       paddingY: `${theme.spacing(8)} !important`,
  //     }}>
  //       <Box sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         marginBottom: 4
  //       }}>
  //         <Box>
  //           <Typography variant="h4">{__('Welcome Back', 'acadlix')}</Typography>
  //         </Box>
  //         <Box>
  //           <Typography variant="body2">{__('Please enter your details to sign in.', 'acadlix')}</Typography>
  //         </Box>
  //         {
  //           methods?.watch("error") &&
  //           <Alert severity="error" sx={{
  //             alignItems: "center"
  //           }}>
  //             {
  //               methods?.watch("error_code") && methods?.watch("error_code") === "incorrect_password" ?
  //                 <>
  //                   <strong>{__('Error:', 'acadlix')}</strong> {__('The password you entered for the username', 'acadlix')} <strong>{methods?.watch("username")}</strong> {__('is incorrect.', 'acadlix')}
  //                   <Link
  //                     href="#"
  //                     onClick={(e) => {
  //                       e?.preventDefault();
  //                       props?.setValue("login_modal_type", "forgot-password", {
  //                         shouldDirty: true,
  //                       });
  //                     }}
  //                   >
  //                     {__("Lost your password?", 'acadlix')}
  //                   </Link>
  //                 </>
  //                 :
  //                 <RawHTML>{methods?.watch("error")}</RawHTML>
  //             }
  //           </Alert>
  //         }
  //       </Box>
  //       <Divider sx={{
  //         marginBottom: 4
  //       }} />
  //       <form onSubmit={methods?.handleSubmit(handleSubmit)}>
  //         <Grid container gap={3}>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Username/Email', 'acadlix')} <span style={{ color: "red" }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...methods?.register("username", { required: true })}
  //               fullWidth
  //               required
  //               autoComplete="username"
  //               autoCapitalize="off"
  //               size="small"
  //               type="text"
  //               name="username"
  //               placeholder={__('Username/email', 'acadlix')}
  //               value={methods?.watch("username")}
  //               onChange={(e) => {
  //                 methods?.setValue("username", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               error={Boolean(methods?.formState?.errors?.username)}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Password', 'acadlix')} <span style={{ color: "red" }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...methods?.register("password", { required: true })}
  //               fullWidth
  //               required
  //               autoComplete="password"
  //               autoCapitalize="off"
  //               size="small"
  //               name="password"
  //               placeholder={__('Password', 'acadlix')}
  //               value={methods?.watch("password")}
  //               onChange={(e) => {
  //                 methods?.setValue("password", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               type={showPassword ? "text" : "password"}
  //               InputProps={{
  //                 endAdornment: (
  //                   <InputAdornment position="end">
  //                     <IconButton
  //                       aria-label="toggle password visibility"
  //                       onClick={() => setShowPassword((show) => !show)}
  //                       onMouseDown={(e) => e.preventDefault()}
  //                       onMouseUp={(e) => e?.preventDefault()}
  //                       edge="end"
  //                       sx={{
  //                         boxShadow: "none",
  //                       }}
  //                     >
  //                       {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
  //                     </IconButton>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //               error={Boolean(methods?.formState?.errors?.password)}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Box sx={{
  //               display: "flex",
  //               justifyContent: "space-between",
  //               alignItems: "center"
  //             }}>
  //               <FormControlLabel
  //                 label={__("Remember me", 'acadlix')}
  //                 control={
  //                   <Checkbox
  //                     checked={methods?.watch("rememberme")}
  //                     onClick={() => {
  //                       methods?.setValue("rememberme", !methods?.watch("rememberme"), { shouldDirty: true });
  //                     }}
  //                   />
  //                 }
  //               />
  //               <Link
  //                 href="#"
  //                 onClick={(e) => {
  //                   e?.preventDefault();
  //                   props?.setValue("login_modal_type", "forgot-password", {
  //                     shouldDirty: true,
  //                   });
  //                 }}
  //               >
  //                 {__("Lost your password?", 'acadlix')}
  //               </Link>
  //             </Box>
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Button
  //               loading={isLoading}
  //               fullWidth
  //               variant="contained"
  //               type="submit"
  //             >
  //               {__('Login', 'acadlix')}
  //             </Button>
  //           </Grid>
  //           {
  //             props?.watch("users_can_register") &&
  //             <Grid size={{ xs: 12, lg: 12 }} sx={{
  //               display: "flex",
  //               justifyContent: "center"
  //             }}>
  //               <Typography variant="body2">
  //                 {__("Don't have account yet?", 'acadlix')}{" "}
  //                 <Link
  //                   href="#"
  //                   onClick={(e) => {
  //                     e?.preventDefault();
  //                     props?.setValue("login_modal_type", "register", {
  //                       shouldDirty: true,
  //                     });
  //                   }}
  //                 >
  //                   {__('Register', 'acadlix')}
  //                 </Link>
  //               </Typography>
  //             </Grid>
  //           }
  //         </Grid>
  //       </form>
  //     </DialogContent>
  //   </>
  // );
};

export default Login;
