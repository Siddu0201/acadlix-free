import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import RegisterText from "./register-options/RegisterText";
import RegisterEmail from "./register-options/RegisterEmail";
import RegisterPassword from "./register-options/RegisterPassword";
import RegisterTel from "./register-options/RegisterTel";
import RegisterUrl from "./register-options/RegisterUrl";
import RegisterCountry from "./register-options/RegisterCountry";
import RegisterTextarea from "./register-options/RegisterTextarea";

const Register = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm({
    defaultValues: {
      data: acadlixOptions?.settings?.acadlix_registration_fields || [],
      error: "",
    }
  });

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }

  const handleSubmit = async (data) => {
    methods?.setValue("error", "", { shouldDirty: true });
    setIsLoading(true);
    if (acadlixOptions.isReCaptchaEnabled) {
      const response = await window.grecaptcha.execute(acadlixOptions.settings.acadlix_v3_site_key, { action: 'acadlix_register' });
      data['g-recaptcha-response'] = response;
    }
    axios
      .post(
        props?.ajax_url,
        new URLSearchParams({
          action: "acadlix_register",
          nonce: props?.nonce,
          data: JSON.stringify(methods?.watch("data")),
        })
      )
      .then((res) => {
        setIsLoading(false);
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.register.response', true, res, props);

        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
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
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.register.error', true, err, props);
        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
        methods?.setValue("error", __("Opps!Something went wrong.", 'acadlix'), { shouldDirty: true });
        console.error(err);
      });
  };

  const getComponentByType = (type, data, index, methods) => {
    switch (type) {
      case "text":
        return <RegisterText key={index} data={data} index={index} {...methods} />;
      case "email":
        return <RegisterEmail key={index} data={data} index={index} {...methods} />;
      case "password":
        return <RegisterPassword key={index} data={data} index={index} {...methods} />;
      case "tel":
        return <RegisterTel key={index} data={data} index={index} {...methods} />;
      case "url":
        return <RegisterUrl key={index} data={data} index={index} {...methods} />;
      case "country":
        return <RegisterCountry key={index} data={data} index={index} {...methods} />;
      case "textarea":
        return <RegisterTextarea key={index} data={data} index={index} {...methods} />;
      default:
        return <RegisterText key={index} data={data} index={index} {...methods} />;
    }
  };

  const defaultSetting = {
    component: "Fragment",
    component_name: "register_modal_fragment",
    children: [
      {
        component: "Box",
        component_name: "register_modal_header_box",
        props: {
          sx: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: {
              xs: 4,
              sm: 2,
            }
          }
        },
        children: [
          {
            component: "Box",
            component_name: "register_modal_welcome_box",
            children: [
              {
                component: "Typography",
                props: {
                  component: "div",
                  variant: "h4",
                },
                value: __("Welcome Back", "acadlix")
              }
            ]
          },
          {
            component: "Box",
            component_name: "register_modal_details_box",
            children: [
              {
                component: "Typography",
                component_name: "register_modal_details_typography",
                props: {
                  component: "div",
                  variant: "body2",
                },
                value: __("Please enter your details to sign up.", "acadlix")
              }
            ]
          },
          {
            component: "Alert",
            component_name: "register_modal_error_alert",
            props: {
              severity: "error",
              sx: {
                display: methods?.watch("error") ? "flex" : "none",
                alignItems: "center"
              }
            },
            children: [
              {
                component: "RawHTML",
                component_name: "register_modal_error_rawhtml",
                value: methods?.watch("error")
              }
            ]
          }
        ]
      },
      {
        component: "Divider",
        component_name: "register_modal_divider",
        props: {
          sx: {
            marginBottom: {
              xs: 4,
              sm: 2,
            }
          }
        }
      },
      {
        component: "form",
        component_name: "register_modal_form",
        props: {
          onSubmit: methods?.handleSubmit(handleSubmit)
        },
        children: [
          {
            component: "Grid",
            component_name: "register_modal_form_grid",
            props: {
              container: true,
              spacing: { xs: 3, sm: 2 },
            },
            children: [
              {
                component: "Fragment",
                children: methods?.watch("data")?.length > 0 && methods?.watch("data")?.map((field, index) => {
                  return {
                    component: getComponentByType(field?.type, field, index, methods)
                  };
                }),
              },
              {
                component: "Grid",
                component_name: "register_modal_form_grid_item_register_button",
                props: {
                  size: { xs: 12, lg: 12 },
                },
                children: [
                  {
                    component: "Button",
                    component_name: "register_modal_form_register_button",
                    props: {
                      className: 'acadlix-btn',
                      loading: isLoading,
                      fullWidth: true,
                      variant: "contained",
                      type: "submit",
                    },
                    value: __("Register", "acadlix")
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "register_modal_form_grid_item_login_forgot_password_links",
                props: {
                  size: { xs: 12, lg: 12 },
                  sx: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "register_modal_form_login_forgot_password_typography",
                    props: {
                      component: "div",
                      variant: "body2",
                    },
                    children: [
                      {
                        component: "span",
                        component_name: "register_modal_form_already_have_account_span",
                        value: __("Already have account? ", "acadlix")
                      },
                      {
                        component: "Link",
                        component_name: "register_modal_form_login_link",
                        props: {
                          href: "#",
                          onClick: (e) => {
                            e?.preventDefault();
                            props?.setValue("login_modal_type", "login", {
                              shouldDirty: true,
                            });
                          },
                          sx: {
                            cursor: "pointer",
                          }
                        },
                        value: __("Login", "acadlix")
                      },
                      {
                        component: "span",
                        component_name: "register_modal_form_separator_span",
                        value: " | "
                      },
                      {
                        component: "Link",
                        component_name: "register_modal_form_forgot_password_link",
                        props: {
                          href: "#",
                          onClick: (e) => {
                            e?.preventDefault();
                            props?.setValue("login_modal_type", "forgot-password", {
                              shouldDirty: true,
                            });
                          },
                          sx: {
                            cursor: "pointer",
                          }
                        },
                        value: __("Lost your password?", "acadlix")
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

  const registerSettings = window?.acadlixHooks?.applyFilters(
    "acadlix.front.user_auth.register",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
      handleSubmit: handleSubmit,
      props: props,
    }
  );

  return (
    <>
      {registerSettings?.map((field, i) => (
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
  //       paddingY: {
  //         xs: `${theme.spacing(8)} !important`,
  //         sm: `${theme.spacing(4)} !important`
  //       },
  //     }}>
  //       <Box sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         marginBottom: {
  //           xs: 4,
  //           sm: 2,
  //         }
  //       }}>
  //         <Box>
  //           <Typography variant="h4">{__('Welcome Back', 'acadlix')}</Typography>
  //         </Box>
  //         <Box>
  //           <Typography variant="body2">{__('Please enter your details to sign up.', 'acadlix')}</Typography>
  //         </Box>
  //         {
  //           methods?.watch("error") &&
  //           <Alert severity="error" sx={{
  //             alignItems: "center"
  //           }}>
  //             <RawHTML>{methods?.watch("error")}</RawHTML>
  //           </Alert>
  //         }
  //       </Box>
  //       <Divider sx={{
  //         marginBottom: {
  //           xs: 4,
  //           sm: 2,
  //         }
  //       }} />
  //       <form onSubmit={methods?.handleSubmit(handleSubmit)}>
  //         <Grid container gap={{ xs: 3, sm: 2 }}>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Username', 'acadlix')} <span style={{ color: "red" }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...methods?.register("username", { required: __('Username is required', 'acadlix') })}
  //               fullWidth
  //               required
  //               autoComplete="username"
  //               autoCapitalize="off"
  //               size="small"
  //               type="text"
  //               name="username"
  //               placeholder={__("Username", 'acadlix')}
  //               value={methods?.watch("username")}
  //               onChange={(e) => {
  //                 methods?.setValue("username", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               error={Boolean(methods?.formState?.errors?.username)}
  //               helperText={methods?.formState?.errors?.username?.message}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Email', 'acadlix')} <span style={{ color: "red" }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...methods?.register("email", { required: __('Email is required', 'acadlix') })}
  //               fullWidth
  //               required
  //               autoComplete="email"
  //               autoCapitalize="off"
  //               size="small"
  //               type="text"
  //               name="email"
  //               placeholder={__("Email", 'acadlix')}
  //               value={methods?.watch("email")}
  //               onChange={(e) => {
  //                 methods?.setValue("email", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               error={Boolean(methods?.formState?.errors?.email)}
  //               helperText={methods?.formState?.errors?.email?.message}
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
  //               {...methods?.register("password", {
  //                 required: __('Password is required', 'acadlix'),
  //                 minLength: {
  //                   value: 8,
  //                   message: __('Password must have at least 8 characters', 'acadlix')
  //                 },
  //               })}
  //               fullWidth
  //               required
  //               autoComplete="password"
  //               autoCapitalize="off"
  //               size="small"
  //               name="password"
  //               placeholder={__("Password", 'acadlix')}
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
  //               helperText={methods?.formState?.errors?.password?.message}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 fontWeight: 500,
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Confirm Password', 'acadlix')} <span style={{ color: "red" }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...methods?.register("confirm_password", {
  //                 required: __('Confirm password is required', 'acadlix'),
  //                 minLength: {
  //                   value: 8,
  //                   message: __('Confirm password must have at least 8 characters', 'acadlix')
  //                 },
  //                 validate: (val) => {
  //                   if (methods?.watch("password") != val) {
  //                     return __('Your passwords do no match', 'acadlix');
  //                   }
  //                 },
  //               })}
  //               fullWidth
  //               required
  //               autoComplete="confirm_password"
  //               autoCapitalize="off"
  //               size="small"
  //               name="confirm_password"
  //               placeholder={__("Confirm Password", 'acadlix')}
  //               value={methods?.watch("confirm_password")}
  //               onChange={(e) => {
  //                 methods?.setValue("confirm_password", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               type={showConfirmPassword ? "text" : "password"}
  //               InputProps={{
  //                 endAdornment: (
  //                   <InputAdornment position="end">
  //                     <IconButton
  //                       aria-label="toggle password visibility"
  //                       onClick={() => setShowConfirmPassword((show) => !show)}
  //                       onMouseDown={(e) => e.preventDefault()}
  //                       onMouseUp={(e) => e?.preventDefault()}
  //                       edge="end"
  //                       sx={{
  //                         boxShadow: "none",
  //                       }}
  //                     >
  //                       {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
  //                     </IconButton>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //               error={Boolean(methods?.formState?.errors?.confirm_password)}
  //               helperText={methods?.formState?.errors?.confirm_password?.message}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }}>
  //             <Button
  //               loading={isLoading}
  //               fullWidth
  //               variant="contained"
  //               type="submit"
  //             >
  //               {__('Register', 'acadlix')}
  //             </Button>
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 12 }} sx={{
  //             display: "flex",
  //             justifyContent: "center"
  //           }}>
  //             <Typography variant="body2">
  //               {__("Already have account?", 'acadlix')} {" "}
  //               <Link
  //                 href="#"
  //                 onClick={(e) => {
  //                   e?.preventDefault();
  //                   props?.setValue("login_modal_type", "login", {
  //                     shouldDirty: true,
  //                   });
  //                 }}
  //               >
  //                 {__('Login', 'acadlix')}
  //               </Link>
  //               {" | "}
  //               <Link
  //                 href="#"
  //                 onClick={(e) => {
  //                   e?.preventDefault();
  //                   props?.setValue("login_modal_type", "forgot-password", {
  //                     shouldDirty: true,
  //                   });
  //                 }}
  //               >
  //                 {__('Lost your password?', 'acadlix')}
  //               </Link>
  //             </Typography>
  //           </Grid>
  //         </Grid>
  //       </form>
  //     </DialogContent>
  //   </>
  // );
};

export default Register;
