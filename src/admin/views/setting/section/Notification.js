import React from "react";
import {
  Box,
  FormControlLabel,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { useForm } from "react-hook-form";
import { PostTestEmail } from "@acadlix/requests/admin/AdminSettingRequest";
import { __ } from "@wordpress/i18n";
import CustomTypography from "@acadlix/components/CustomTypography";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

function Notification(props) {
  const defaultSetting = {
    component: "Card",
    component_name: "notification_card",
    children: [
      {
        component: "CardContent",
        component_name: "notification_card_content",
        children: [
          {
            component: "Box",
            component_name: "notification_box",
            children: [
              {
                component: "Box",
                component_name: "notification_header_box",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "notification_header_title_typography",
                    props: {
                      variant: "h4",
                    },
                    value: __("Email Settings", "acadlix"),
                  },
                  {
                    component: "Divider",
                    component_name: "notification_header_divider",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "notification_grid_container",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "notification_course_purchase_title_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "notification_course_purchase_title_typography",
                        value: __("Notify Course Purchase To", "acadlix")
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_course_purchase_student_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_course_purchase_student_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Student", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_course_purchase_to_student") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_course_purchase_to_student",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_course_purchase_admin_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_course_purchase_admin_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Admin", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_course_purchase_to_admin") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_course_purchase_to_admin",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_course_completion_title_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "notification_course_completion_title_typography",
                        value: __("Notify Course Completion To", "acadlix")
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_course_completion_student_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_course_completion_student_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Student", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_course_completion_to_student") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_course_completion_to_student",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_course_completion_admin_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_course_completion_admin_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Admin", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_course_completion_to_admin") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_course_completion_to_admin",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_failed_transaction_title_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "notification_failed_transaction_title_typography",
                        value: __("Notify Failed Transaction To", "acadlix")
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_failed_transaction_student_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_failed_transaction_student_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Student", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_failed_transation_to_student") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_failed_transation_to_student",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_failed_transaction_admin_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_failed_transaction_admin_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Admin", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_failed_transation_to_admin") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_failed_transation_to_admin",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_offline_purchase_title_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "notification_offline_purchase_title_typography",
                        value: __("Notify Offline Purchase To", "acadlix")
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_offline_purchase_student_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_offline_purchase_student_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Student", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_offline_purchase_to_student") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_offline_purchase_to_student",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "notification_offline_purchase_admin_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "FormControlLabel",
                        component_name: "notification_offline_purchase_admin_form_control_label",
                        props: {
                          control: {
                            component: "CustomSwitch",
                          },
                          label: __("Admin", "acadlix"),
                          value: "yes",
                          checked: props?.watch("acadlix_notify_offline_purchase_to_admin") === "yes",
                          onClick: (e) => {
                            if (e?.target?.checked !== undefined) {
                              props?.setValue(
                                "acadlix_notify_offline_purchase_to_admin",
                                e?.target?.checked ? e?.target?.value : "no",
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }
                        }
                      },
                    ],
                  },
                ],
              }
            ],
          },
        ],
      },
      {
        component: "CardActions",
        component_name: "notification_card_actions",
        children: [
          {
            component: "Button",
            component_name: "notification_card_actions_button",
            props: {
              variant: "contained",
              color: "primary",
              type: "submit",
              loading: props?.isPending,
            },
            value: __("Save Changes", "acadlix")
          }
        ]
      }
    ]
  };

  const notification = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.setting.notification",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      isPending: props?.isPending,
    }
  ) ?? [];

  return (
    <>
      {notification.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: props?.register,
              setValue: props?.setValue,
              watch: props?.watch,
              control: props?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )

  // return (
  //   <Card>
  //     <CardContent>
  //       <Box>
  //         <Box
  //           sx={{
  //             marginY: 2,
  //           }}
  //         >
  //           <Typography variant="h4">{__("Email Settings", "acadlix")}</Typography>
  //           <Divider />
  //         </Box>
  //         <Grid
  //           container
  //           spacing={{
  //             xs: 2,
  //             sm: 4,
  //           }}
  //           sx={{
  //             alignItems: "center",
  //           }}
  //         >
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <CustomTypography>
  //               {__("Notify Course Purchase To", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Student", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_course_purchase_to_student") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_course_purchase_to_student",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Admin", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_course_purchase_to_admin") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_course_purchase_to_admin",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <CustomTypography>
  //               {__("Notify Course Completion To", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Student", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_course_completion_to_student") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_course_completion_to_student",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Admin", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_course_completion_to_admin") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_course_completion_to_admin",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <CustomTypography>
  //               {__("Notify Failed Transaction To", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Student", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_failed_transation_to_student") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_failed_transation_to_student",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, lg: 4 }}>
  //             <FormControlLabel
  //               control={<CustomSwitch />}
  //               label={__("Admin", "acadlix")}
  //               value="yes"
  //               checked={props?.watch("acadlix_notify_failed_transation_to_admin") === "yes"}
  //               onClick={(e) => {
  //                 if (e?.target?.checked !== undefined) {
  //                   props?.setValue(
  //                     "acadlix_notify_failed_transation_to_admin",
  //                     e?.target?.checked ? e?.target?.value : "no",
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //             />
  //           </Grid>

  //           {/* <TestingEmail /> */}
  //         </Grid>
  //       </Box>
  //     </CardContent>
  //     <CardActions>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         type="submit"
  //         loading={props?.isPending}
  //       >
  //         {__("Save", "acadlix")}
  //       </Button>
  //     </CardActions>
  //   </Card>
  // );
}

export default Notification;

const TestingEmail = (props) => {
  const methods = useForm({
    defaultValues: {
      to: "",
      subject: "",
      message: "",
    }
  });
  const testingEmailMutation = PostTestEmail();
  const handleSend = (data) => {
    testingEmailMutation?.mutate(data, {
      onSuccess: (data) => {
        toast.success(__('Email sent successfully.', 'acadlix'));
      }
    });
  }
  return (
    <React.Fragment>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("to")}
          fullWidth
          size="small"
          label={__("To", "acadlix")}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("subject")}
          fullWidth
          size="small"
          label={__("Subject", "acadlix")}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <CustomTextField
          {...methods?.register("message")}
          fullWidth
          size="small"
          label={__("Message", "acadlix")}
          multiline
          rows={3}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Button variant="contained" color="primary" onClick={methods?.handleSubmit(handleSend)}>
          {__("Send", "acadlix")}
        </Button>
      </Grid>
    </React.Fragment>
  )
}
