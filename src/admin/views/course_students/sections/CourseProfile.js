import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const CourseProfile = (props) => {
  const defaultSetting = {
    component: "Card",
    children: [
      {
        component: "CardContent",
        children: [
          {
            component: "Box",
            props: {
              sx: {
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              },
            },
            children: [
              {
                component: "Avatar",
                props: {
                  sx: {
                    width: 180,
                    height: 120,
                  },
                  variant: "rounded",
                  src: props?.watch('course')?.thumbnail?.url || acadlixOptions?.default_img_url || "",
                }
              },
              {
                component: "Box",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  },
                },
                children: [
                  {
                    component: "Box",
                    children: [
                      {
                        component: "Typography",
                        props: {
                          variant: "h4",
                        },
                        value: props?.watch('course.post_title')
                      }
                    ]
                  },
                  {
                    component: "Box",
                    sx: {
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between"
                    },
                    children: [
                      {
                        component: "Box",
                        props: {
                          sx: {
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                          },
                        },
                        children: [
                          {
                            component: "Typography",
                            props: {
                              variant: "body2",
                              color: 'text.secondary',
                            },
                            value: __("Category:", "acadlix")
                          },
                          {
                            component: "Typography",
                            props: {
                              variant: "body2",
                            },
                            value: props?.watch('course')?.course_categories?.map((cat) => cat?.term?.name)?.join(", ")
                          }
                        ],
                      },
                    ],
                  },
                  {
                    component: "Box",
                    props: {
                      sx: {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                      },
                    },
                    children: [
                      {
                        component: "Box",
                        props: {
                          sx: {
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                          },
                        },
                        children: [
                          {
                            component: "Typography",
                            props: {
                              variant: "body2",
                              color: 'text.secondary',
                            },
                            value: __("Author:", "acadlix")
                          },
                          {
                            component: "Typography",
                            props: {
                              variant: "body2",
                            },
                            value: props?.watch('course')?.author?.display_name
                          }
                        ],
                      },
                    ],
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const course_profile = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course.course_student.course_profile",
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
      {course_profile.map((field, i) => (
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

export default CourseProfile