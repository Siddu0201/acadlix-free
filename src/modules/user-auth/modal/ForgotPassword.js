import React from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const ForgotPassword = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const methods = useForm({
    defaultValues: {
      username: "",
      submit: false,
      error: "",
    }
  });

  const handleSubmit = async (data) => {
    methods?.setValue("error", "", { shouldDirty: true });
    setIsLoading(true);
    if (acadlixOptions.isReCaptchaEnabled) {
      const response = await window.grecaptcha.execute(acadlixOptions.settings.acadlix_v3_site_key, { action: 'acadlix_forgot_password' });
      data['g-recaptcha-response'] = response;
    }
    axios.post(
      props?.ajax_url,
      new URLSearchParams({
        action: "acadlix_forgot_password",
        nonce: props?.nonce,
        ...data
      }))
      .then((res) => {
        setIsLoading(false);
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.forgot_password.response', true, res, props);
        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
        if (res?.data?.success) {
          methods?.setValue("submit", true, { shouldDirty: true });
          if (props?.onSuccessForgotPassword) {
            props?.onSuccessForgotPassword(res?.data?.data);
          }
        } else {
          methods?.setValue("error", res?.data?.data?.message, { shouldDirty: true });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const shouldContinue = window?.acadlixHooks?.applyFilters?.('acadlix.front.user_auth.forgot_password.error', true, err, props);
        if (!shouldContinue) {
          return; // Stop here if hook handled it
        }
        methods?.setValue("error", __("Opps! Something went wrong.", 'acadlix'), { shouldDirty: true });
        console.error(err);
      });
  }

  const defaultSetting = {
    component: "Fragment",
    component_name: "forgot_password_modal_fragment",
    children: [
      {
        component: "Box",
        component_name: "forgot_password_modal_header_box",
        props: {
          sx: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            marginBottom: 4
          }
        },
        children: [
          {
            component: "Alert",
            component_name: "forgot_password_modal_info_alert",
            props: {
              severity: "info",
              sx: { alignItems: "center" }
            },
            value: __("Please enter your username or email address. You will receive an email message with instructions on how to reset your password.", 'acadlix')
          },
          {
            component: "Alert",
            component_name: "forgot_password_modal_error_alert",
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
                component_name: "forgot_password_modal_error_rawhtml",
                value: methods?.watch("error")
              }
            ]
          }
        ]
      },
      {
        component: "Divider",
        component_name: "forgot_password_modal_divider",
        props: { sx: { marginBottom: 4 } }
      },
      {
        component: "form",
        props: {
          onSubmit: methods?.handleSubmit(handleSubmit)
        },
        children: [
          {
            component: "Grid",
            component_name: "forgot_password_modal_form_grid",
            props: { container: true, gap: 3 },
            children: [
              !methods?.watch("submit") ?
                ({
                  component: "Fragment",
                  component_name: "forgot_password_modal_form_fragment",
                  children: [
                    {
                      component: "Grid",
                      component_name: "forgot_password_modal_username_grid",
                      props: {
                        size: { xs: 12, lg: 12 },
                        sx: { display: methods?.watch("submit") ? "none" : "block" }
                      },
                      children: [
                        {
                          component: "Typography",
                          component_name: "forgot_password_modal_username_typography",
                          props: { 
                            component: "div",
                            variant: "body2", 
                            sx: { paddingY: 1 } },
                          children: [
                            { component: "span", value: __("Username/Email", 'acadlix') },
                            { component: "span", props: { style: { color: "red" } }, value: "*" }
                          ]
                        },
                        {
                          component: "CustomTextField",
                          component_name: "forgot_password_modal_username_textfield",
                          props: {
                            ...methods?.register("username", { required: true }),
                            fullWidth: true,
                            required: true,
                            autoComplete: "username",
                            autoCapitalize: "off",
                            size: "small",
                            type: "text",
                            name: "username",
                            placeholder: __("Username/email", 'acadlix'),
                            // value: methods?.watch("username"),
                            onChange: (e) => methods?.setValue("username", e?.target?.value, { shouldDirty: true }),
                            error: Boolean(methods?.formState?.errors?.username)
                          }
                        }
                      ]
                    },
                    {
                      component: "Grid",
                      component_name: "forgot_password_modal_button_grid",
                      props: {
                        size: { xs: 12, lg: 12 },
                        sx: {
                          display: methods?.watch("submit") ? "none" : "block"
                        }
                      },
                      children: [
                        {
                          component: "Button",
                          component_name: "forgot_password_modal_button",
                          props: {
                            className: 'acadlix-btn',
                            loading: isLoading,
                            fullWidth: true,
                            variant: "contained",
                            type: "submit"
                          },
                          value: __("Get New Password", 'acadlix')
                        }
                      ]
                    },
                  ]
                })
                :
                ({
                  component: "Grid",
                  component_name: "forgot_password_modal_success_grid",
                  props: {
                    size: { xs: 12, lg: 12 },
                    sx: {
                      display: methods?.watch("submit") ? "flex" : "none"
                    }
                  },
                  children: [
                    {
                      component: "Alert",
                      component_name: "forgot_password_modal_success_alert",
                      props: {
                        severity: "success"
                      },
                      value: __("Check your email for the confirmation link, then visit the login page.", 'acadlix')
                    }
                  ]
                }),
              {
                component: "Grid",
                component_name: "forgot_password_modal_login_grid",
                props: {
                  size: { xs: 12, lg: 12 },
                  sx: {
                    display: "flex",
                    justifyContent: "center"
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "forgot_password_modal_login_typography",
                    props: { component: "div", variant: "body2" },
                    children: [
                      {
                        component: "Link",
                        component_name: "forgot_password_modal_login_link",
                        props: {
                          href: "#",
                          onClick: (e) => {
                            e?.preventDefault();
                            props?.setValue("login_modal_type", "login", { shouldDirty: true });
                          }
                        },
                        value: __("Login", 'acadlix')
                      },
                      {
                        component: "span",
                        component_name: "forgot_password_modal_register_span",
                        props: {
                          style: {
                            display: props?.watch("users_can_register") ? "inline" : "none"
                          }
                        },
                        children: [
                          {
                            component: "span",
                            component_name: "forgot_password_modal_register_separator_span",
                            value: " \u00A0|\u00A0 "
                          },
                          {
                            component: "Link",
                            component_name: "forgot_password_modal_register_link",
                            props: {
                              href: "#",
                              onClick: (e) => {
                                e?.preventDefault();
                                props?.setValue("login_modal_type", "register", { shouldDirty: true });
                              }
                            },
                            value: __("Register", 'acadlix')
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
      }
    ]
  };

  const forgotPasswordSettings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.user_auth.forgot_password",
    [defaultSetting],
    {
      register: methods?.register,
      watch: methods?.watch,
      setValue: methods?.setValue,
      control: methods?.control,
      handleSubmit: handleSubmit,
      props: props,
    }
  );

  return (
    <>
      {forgotPasswordSettings?.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              watch: methods?.watch,
              setValue: methods?.setValue,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
  // return (
  //     <>
  //         <IconButton
  //             aria-label="close"
  //             onClick={props?.handleClose}
  //             sx={{
  //                 position: "absolute",
  //                 right: 8,
  //                 top: 8,
  //                 color: (theme) => theme.palette.grey[500],
  //                 boxShadow: "none",
  //             }}
  //         >
  //             <IoClose style={{
  //                 fontSize: 20
  //             }} />
  //         </IconButton>
  //         <DialogContent sx={{
  //             paddingX: {
  //                 xs: `${theme.spacing(4)} !important`,
  //                 sm: `${theme.spacing(8)} !important`,
  //             },
  //             paddingY: `${theme.spacing(8)} !important`,
  //         }}>
  //             <Box sx={{
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 gap: 2,
  //                 alignItems: "center",
  //                 marginBottom: 4
  //             }}>
  //                 <Alert severity="info" sx={{
  //                     alignItems: "center"
  //                 }}>
  //                     {__("Please enter your username or email address. You will receive an email message with instructions on how to reset your password.", 'acadlix')}
  //                 </Alert>
  //                 {
  //                     methods?.watch("error") &&
  //                     <Alert severity="error" sx={{
  //                         alignItems: "center"
  //                     }}>
  //                         <RawHTML>{methods?.watch("error")}</RawHTML>
  //                     </Alert>
  //                 }
  //             </Box>
  //             <Divider sx={{
  //                 marginBottom: 4
  //             }} />
  //             <form onSubmit={methods?.handleSubmit(handleSubmit)}>
  //                 <Grid container gap={3}>
  //                     {
  //                         !methods?.watch("submit") ?
  //                             <>
  //                                 <Grid size={{ xs: 12, lg: 12 }}>
  //                                     <Typography
  //                                         variant="body2"
  //                                         sx={{
  //                                             paddingY: 1,
  //                                         }}
  //                                     >
  //                                         {__("Username/Email", 'acadlix')} <span style={{ color: "red" }}>*</span>
  //                                     </Typography>
  //                                     <CustomTextField
  //                                         {...methods?.register("username", { required: true })}
  //                                         fullWidth
  //                                         required
  //                                         autoComplete="username"
  //                                         autoCapitalize="off"
  //                                         size="small"
  //                                         type="text"
  //                                         name="username"
  //                                         placeholder={__("Username/email", 'acadlix')}
  //                                         value={methods?.watch("username")}
  //                                         onChange={(e) => {
  //                                             methods?.setValue("username", e?.target?.value, {
  //                                                 shouldDirty: true,
  //                                             });
  //                                         }}
  //                                         error={Boolean(methods?.formState?.errors?.username)}
  //                                     />
  //                                 </Grid>
  //                                 <Grid size={{ xs: 12, lg: 12 }}>
  //                                     <Button
  //                                         loading={isLoading}
  //                                         fullWidth
  //                                         variant="contained"
  //                                         type="submit"
  //                                     >
  //                                         {__("Get New Password", 'acadlix')}
  //                                     </Button>
  //                                 </Grid>
  //                             </>
  //                             :
  //                             <Grid size={{ xs: 12, lg: 12 }}>
  //                                 <Alert severity="success">
  //                                     {__("Check your email for the confirmation link, then visit the login page.", 'acadlix')}
  //                                 </Alert>
  //                             </Grid>
  //                     }
  //                     <Grid size={{ xs: 12, lg: 12 }} sx={{
  //                         display: "flex",
  //                         justifyContent: "center"
  //                     }}>
  //                         <Typography variant="body2">
  //                             <Link
  //                                 href="#"
  //                                 onClick={(e) => {
  //                                     e?.preventDefault();
  //                                     props?.setValue("login_modal_type", "login", {
  //                                         shouldDirty: true,
  //                                     });
  //                                 }}
  //                             >
  //                                 {__("Login", 'acadlix')}
  //                             </Link>

  //                             {props?.watch("users_can_register") &&
  //                                 <>
  //                                     &nbsp;|&nbsp;
  //                                     <Link
  //                                         href="#"
  //                                         onClick={(e) => {
  //                                             e?.preventDefault();
  //                                             props?.setValue("login_modal_type", "register", {
  //                                                 shouldDirty: true,
  //                                             });
  //                                         }}
  //                                     >
  //                                         {__("Register", 'acadlix')}
  //                                     </Link>
  //                                 </>
  //                             }
  //                         </Typography>
  //                     </Grid>
  //                 </Grid>
  //             </form>
  //         </DialogContent>
  //     </>
  // )
}

export default ForgotPassword
