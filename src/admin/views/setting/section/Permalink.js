import React from "react";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const Permalink = (props) => {
  const defaultSetting = {
    component: "Card",
    component_name: "setting_permalink_card",
    children: [
      {
        component: "CardContent",
        component_name: "setting_permalink_card_content",
        children: [
          {
            component: "Box",
            component_name: "setting_permalink_box",
            children: [
              {
                component: "Box",
                component_name: "setting_permalink_course_title_box",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "setting_permalink_course_title_typography",
                    props: {
                      variant: "h4",
                    },
                    children: [
                      {
                        component: "span",
                        value: __("Course Permalink", "acadlix")
                      },
                      {
                        component: "CustomFeatureTooltip",
                        component_name: "setting_permalink_course_tooltip",
                        props: {
                          plan: "open",
                          msg: __("Refer docs to configure Permalinks.", "acadlix"),
                          placement: "right-start",
                          redirectTo: `${acadlixOptions?.acadlix_docs_url}settings/permalink/`
                        }
                      }
                    ]
                  },
                  {
                    component: "Divider",
                    component_name: "setting_permalink_divider"
                  }
                ]
              },
              {
                component: "Grid",
                component_name: "setting_permalink_course_grid_container",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  }
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "setting_permalink_course_grid_item_course_base_label",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "setting_permalink_course_base_label_typography",
                        value: __("Course base", "acadlix")
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_permalink_course_grid_item_course_base_input",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "setting_permalink_course_base_custom_textfield",
                        props: {
                          ...props?.register("acadlix_course_base"),
                          fullWidth: true,
                          size: "small",
                          // value: props?.watch("acadlix_course_base"),
                          onChange: (e) => {
                            props?.setValue("acadlix_course_base", e?.target?.value, {
                              shouldDirty: true,
                            });
                          }
                        }
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "setting_permalink_course_category_base_label_typography",
                        value: __("Category base", "acadlix")
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_permalink_course_grid_item_course_category_base_input",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "setting_permalink_course_category_base_custom_textfield",
                        props: {
                          ...props?.register("acadlix_course_category_base"),
                          fullWidth: true,
                          size: "small",
                          // value: props?.watch("acadlix_course_category_base"),
                          onChange: (e) => {
                            props?.setValue("acadlix_course_category_base", e?.target?.value, {
                              shouldDirty: true,
                            });
                          }
                        }
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_permalink_course_grid_item_course_tag_base_input",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "setting_permalink_course_tag_base_label_typography",
                        value: __("Tag base", "acadlix")
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "setting_permalink_course_grid_item_course_tag_base_input",
                    props: {
                      size: {
                        xs: 12,
                        sm: 6,
                        lg: 3
                      }
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "setting_permalink_course_tag_base_custom_textfield",
                        props: {
                          ...props?.register("acadlix_course_tag_base"),
                          fullWidth: true,
                          size: "small",
                          // value: props?.watch("acadlix_course_tag_base"),
                          onChange: (e) => {
                            props?.setValue("acadlix_course_tag_base", e?.target?.value, {
                              shouldDirty: true,
                            });
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: "CardActions",
        component_name: "setting_permalink_card_actions",
        children: [
          {
            component: "Button",
            component_name: "setting_permalink_save_button",
            props: {
              variant: "contained",
              color: "primary",
              type: "submit",
              loading: props?.isPending
            },
            value: __("Save", "acadlix")
          }
        ]
      }
    ]
  }

  const permalink_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.permalink",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <>
      {permalink_setting.map((field, i) => (
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
  //           <Typography variant="h4">{__("Course Permalink", "acadlix")}
  //             <CustomFeatureTooltip
  //               plan="open"
  //               msg={__("Refer docs to configure Permalinks.", "acadlix")}
  //               placement="right-start"
  //               redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/permalink/`}
  //             />
  //           </Typography>
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
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTypography>
  //               {__("Course base", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               value={props?.watch("acadlix_course_base")}
  //               onChange={(e) => {
  //                 props?.setValue("acadlix_course_base", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTypography>
  //               {__("Category base", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               value={props?.watch("acadlix_course_category_base")}
  //               onChange={(e) => {
  //                 props?.setValue("acadlix_course_category_base", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTypography>
  //               {__("Tag base", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               value={props?.watch("acadlix_course_tag_base")}
  //               onChange={(e) => {
  //                 props?.setValue("acadlix_course_tag_base", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //             />
  //           </Grid>
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
};

export default Permalink;
