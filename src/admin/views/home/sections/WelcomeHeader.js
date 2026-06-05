import { Link } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const WelcomeHeader = (props) => {
  const defaultSetting = {
    component: "Card",
    component_name: "welcome_header_card",
    children: [
      {
        component: "CardContent",
        component_name: "welcome_header_card_content",
        children: [
          {
            component: "Box",
            component_name: "welcome_header_box",
            props: {
              sx: {
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
              },
            },
            children: [
              {
                component: "Box",
                component_name: "welcome_header_inner_box",
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
                    component_name: "welcome_header_custom_typography",
                    props: {
                      variant: "h2",
                    },
                    value: __("Welcome to Acadlix", "acadlix"),
                  },
                  {
                    component: "Typography",
                    component_name: "welcome_header_subtitle_typography",
                    props: {
                      variant: "subtitle1",
                      sx: {
                        color: (theme) => `${theme.palette.text.secondary}`
                      },
                    },
                    value: __("Manage your LMS, quizzes, sales from one place.", "acadlix"),
                  },
                ],
              },
              {
                component: "Box",
                component_name: "welcome_header_action_box",
                props: {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  },
                },
                children: [
                  {
                    component: "Button",
                    component_name: "welcome_header_create_course_button",
                    props: {
                      variant: "contained",
                      color: "primary",
                      component: Link,
                      href: props.watch('createCourseUrl'),
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                    value: `+ ${__("Create Course", "acadlix")}`,
                  },
                  {
                    component: "Button",
                    component_name: "welcome_header_create_quiz_button",
                    props: {
                      variant: "outlined",
                      color: "primary",
                      component: Link,
                      href: props.watch('createQuizUrl'),
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                    value: __("Create Quiz", "acadlix"),
                  }
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const welcome_header = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.welcome_header",
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
      {welcome_header.map((field, i) => (
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

export default WelcomeHeader