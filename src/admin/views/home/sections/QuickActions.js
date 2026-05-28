import CustomTypography from '@acadlix/components/CustomTypography'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Link } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const QuickActions = (props) => {
  const defaultSetting = {
    component: "Card",
    component_name: "quick_actions_card",
    children: [
      {
        component: "CardHeader",
        component_name: "quick_actions_card_header",
        props: {
          title: __("Quick Actions", "acadlix"),
          subheader: __("Frequently used LMS operations", "acadlix"),
          slotProps: {
            title: {
              variant: "h4",
            },
            subheader: {
              variant: "caption",
            }
          },
        },
      },
      {
        component: "CardContent",
        component_name: "quick_actions_card_content",
        children: [
          {
            component: "Grid",
            component_name: "quick_actions_grid_container",
            props: {
              container: true,
              spacing: 2,
            },
            children: [
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_create_course",
                props: {
                  size: {
                    xs: 12,
                    md: 6,
                  },
                },
                children: [
                  {
                    component: <QuickActionButton
                      component={Link}
                      href={props.watch('createCourseUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {__("Create Course", "acadlix")}
                    </QuickActionButton>,
                    component_name: "quick_actions_create_course_button",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_create_quiz",
                props: {
                  size: {
                    xs: 12,
                    md: 6,
                  },
                },
                children: [
                  {
                    component: <QuickActionButton
                      component={Link}
                      href={props.watch('createQuizUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {__("Create Quiz", "acadlix")}
                    </QuickActionButton>,
                    component_name: "quick_actions_create_quiz_button",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_create_lesson",
                props: {
                  size: {
                    xs: 12,
                    md: 6,
                  },
                },
                children: [
                  {
                    component: <QuickActionButton
                      component={Link}
                      href={props.watch('createLessonUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {__("Create Lesson", "acadlix")}
                    </QuickActionButton>,
                    component_name: "quick_actions_create_lesson_button",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_settings",
                props: {
                  size: {
                    xs: 12,
                    md: 6,
                  }
                },
                children: [
                  {
                    component: <QuickActionButton
                      component={Link}
                      href={props.watch('settingsUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {__("Go to Settings", "acadlix")}
                    </QuickActionButton>,
                    component_name: "quick_actions_settings_button",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_divider",
                props: {
                  size: {
                    xs: 12,
                    md: 12,
                  }
                },
                children: [
                  {
                    component: "Divider",
                    component_name: "quick_actions_divider",
                    props: {
                      sx: {
                        marginY: 2,
                      }
                    },
                  }
                ],
              },
              {
                component: "Grid",
                component_name: "quick_actions_grid_item_docs",
                props: {
                  size: {
                    xs: 12,
                    md: 12,
                  }
                },
                children: [
                  {
                    component: "Card",
                    component_name: "quick_actions_docs_card",
                    props: {
                      sx: {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                      }
                    },
                    children: [
                      {
                        component: "CardContent",
                        component_name: "quick_actions_docs_card_content",
                        children: [
                          {
                            component: "Box",
                            component_name: "quick_actions_docs_box",
                            props: {
                              sx: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              },
                            },
                            children: [
                              {
                                component: "CustomTypography",
                                component_name: "quick_actions_docs_custom_typography_caption",
                                props: {
                                  variant: "caption",
                                  sx: {
                                    color: (theme) => theme.palette.primary.contrastText,
                                  },
                                },
                                value: __("Need Help?", "acadlix"),
                              },
                              {
                                component: "CustomTypography",
                                component_name: "quick_actions_docs_custom_typography",
                                props: {
                                  variant: "h4",
                                  sx: {
                                    color: (theme) => theme.palette.primary.contrastText,
                                  },
                                },
                                value: __("Explore Acadlix documentation & support resources.", "acadlix"),
                              },
                              {
                                component: "Box",
                                component_name: "quick_actions_docs_button_box",
                                props: {
                                  sx: {
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                  },
                                },
                                children: [
                                  {
                                    component: "Button",
                                    component_name: "quick_actions_docs_button",
                                    props: {
                                      variant: "contained",
                                      color: "primary",
                                      LinkComponent: Link,
                                      target: "__blank",
                                      href: props.watch('documentationUrl'),
                                      sx: {
                                        backgroundColor: (theme) => theme.palette.primary.contrastText,
                                        color: (theme) => theme.palette.primary.main,
                                        "&:hover, &:focus": {
                                          backgroundColor: (theme) => theme.palette.primary.contrastText,
                                          color: (theme) => theme.palette.primary.main,
                                        }
                                      },
                                    },
                                    value: __("Open Docs", "acadlix"),
                                  },
                                  {
                                    component: "Button",
                                    component_name: "quick_actions_docs_video_button",
                                    props: {
                                      variant: "outlined",
                                      color: "primary",
                                      LinkComponent: Link,
                                      target: "__blank",
                                      href: props.watch('youtubeUrl'),
                                      sx: {
                                        borderColor: (theme) => theme.palette.primary.contrastText,
                                        color: (theme) => theme.palette.primary.contrastText,
                                        "&:hover": {
                                          backgroundColor: (theme) => theme.palette.primary.contrastText,
                                          color: (theme) => theme.palette.primary.main,
                                        },
                                        "&:focus": {
                                          borderColor: (theme) => theme.palette.primary.contrastText,
                                          color: (theme) => theme.palette.primary.contrastText,
                                        }
                                      },
                                    },
                                    value: __("Video Tutorials", "acadlix"),
                                  }
                                ],
                              },
                            ],
                          },
                        ],
                      }
                    ]
                  },
                ]
              }
            ],
          },
        ]
      },
    ]
  };

  const quick_actions = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.quick_actions",
    [defaultSetting],
    {
      register: props?.register,
      setValue: props?.setValue,
      watch: props?.watch,
      control: props?.control,
      quickActionButton: (buttonProps) => (
        <QuickActionButton
          {...buttonProps}
        />
       ),
    }
  );

  return (
    <>
      {quick_actions.map((field, i) => (
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
}

export default QuickActions

const QuickActionButton = (props) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      size="large"
      sx={{
        justifyContent: "flex-start",
        color: (theme) => theme.palette.text.primary,
        borderColor: (theme) => theme.palette.grey[200],
        borderRadius: 2,
      }}
      {...props}
    >
      {props.children}
    </Button>
  )
}