import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const StudentOptions = (props) => {

  const defaultSetting = {
    component: "Grid",
    component_name: "course_student_options_grid",
    props: {
      container: true,
      spacing: {
        xs: 2,
        sm: 4
      }
    },
    children: [
      {
        component: "Grid",
        component_name: "course_student_options_grid_item_enrolled_students",
        props: {
          size: {
            xs: 12,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4
          }
        },
        children: [
          {
            component: "Card",
            component_name: "course_student_options_card_enrolled_students",
            children: [
              {
                component: "CardContent",
                component_name: "course_student_options_card_content_enrolled_students",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                  }
                },
                children: [
                  {
                    component: "Avatar",
                    component_name: "course_student_options_avatar_enrolled_students",
                    props: {
                      sx: {
                        width: 56,
                        height: 56,
                        fontSize: 30,
                        color: "primary.contrastText",
                        backgroundColor: "primary.main"
                      }
                    },
                    children: [
                      {
                        component: "FaGraduationCap",
                        component_name: "course_student_options_avatar_icon_enrolled_students"
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_options_box_enrolled_students",
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_enrolled_students_count",
                        props: {
                          variant: "h4"
                        },
                        value: props?.watch("student_count")
                      },
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_enrolled_students_label",
                        props: {
                          color: "text.secondary",
                          variant: "subtitle2",
                          component: "div"
                        },
                        value: __("Enrolled Students", "acadlix")
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        component: "Grid",
        component_name: "course_student_options_grid_item_completed_courses",
        props: {
          size: {
            xs: 12,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4
          }
        },
        children: [
          {
            component: "Card",
            component_name: "course_student_options_card_completed_courses",
            children: [
              {
                component: "CardContent",
                component_name: "course_student_options_card_content_completed_courses",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                  }
                },
                children: [
                  {
                    component: "Avatar",
                    component_name: "course_student_options_avatar_completed_courses",
                    props: {
                      sx: {
                        width: 56,
                        height: 56,
                        fontSize: 30,
                        color: "success.contrastText",
                        backgroundColor: "success.main"
                      }
                    },
                    children: [
                      {
                        component: "GiDiamondTrophy",
                        component_name: "course_student_options_avatar_icon_completed_courses"
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_options_box_completed_courses",
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_completed_courses_count",
                        props: {
                          variant: "h4"
                        },
                        value: props?.getTotalCompletedCourse()
                      },
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_completed_courses_label",
                        props: {
                          color: "text.secondary",
                          variant: "subtitle2",
                          component: "div"
                        },
                        value: __("Completed Courses", "acadlix")
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        component: "Grid",
        component_name: "course_student_options_grid_item_in_progress_courses",
        props: {
          size: {
            xs: 12,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4
          }
        },
        children: [
          {
            component: "Card",
            component_name: "course_student_options_card_in_progress_courses",
            children: [
              {
                component: "CardContent",
                component_name: "course_student_options_card_content_in_progress_courses",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                  }
                },
                children: [
                  {
                    component: "Avatar",
                    component_name: "course_student_options_avatar_in_progress_courses",
                    props: {
                      sx: {
                        width: 56,
                        height: 56,
                        fontSize: 30,
                        color: "warning.contrastText",
                        backgroundColor: "warning.main"
                      }
                    },
                    children: [
                      {
                        component: "GiProgression",
                        component_name: "course_student_options_avatar_icon_in_progress_courses"
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_options_box_in_progress_courses",
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_in_progress_courses_count",
                        props: {
                          variant: "h4"
                        },
                        value: props?.getTotalInProgressCourse()
                      },
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_in_progress_courses_label",
                        props: {
                          color: "text.secondary",
                          variant: "subtitle2",
                          component: "div"
                        },
                        value: __("In Progress Courses", "acadlix")
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
        component: "Grid",
        component_name: "course_student_options_grid_item_lesson_count",
        props: {
          size: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length,
            xl: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length
          }
        },
        children: [
          {
            component: "Card",
            component_name: "course_student_options_card_lesson_count",
            children: [
              {
                component: "CardContent",
                component_name: "course_student_options_card_content_lesson_count",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                  }
                },
                children: [
                  {
                    component: "Avatar",
                    component_name: "course_student_options_avatar_lesson_count",
                    props: {
                      sx: {
                        width: 56,
                        height: 56,
                        fontSize: 30,
                        color: `${props?.watch("settings.lesson_color")}.contrastText`,
                        backgroundColor: `${props?.watch("settings.lesson_color")}.main`
                      }
                    },
                    children: [
                      {
                        component: "MdPlayLesson",
                        component_name: "course_student_options_avatar_icon_lesson_count"
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_options_box_lesson_count",
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_lesson_count",
                        props: {
                          variant: "h4"
                        },
                        value: props?.watch("course")?.content_overview?.lesson || 0
                      },
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_lesson_label",
                        props: {
                          color: "text.secondary",
                          variant: "subtitle2",
                          component: "div"
                        },
                        value: __("Lesson count", "acadlix")
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
        component: "Grid",
        component_name: "course_student_options_grid_item_quiz_count",
        props: {
          size: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length,
            xl: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length
          }
        },
        children: [
          {
            component: "Card",
            component_name: "course_student_options_card_quiz_count",
            children: [
              {
                component: "CardContent",
                component_name: "course_student_options_card_content_quiz_count",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                  }
                },
                children: [
                  {
                    component: "Avatar",
                    component_name: "course_student_options_avatar_quiz_count",
                    props: {
                      sx: {
                        width: 56,
                        height: 56,
                        fontSize: 30,
                        color: `${props?.watch("settings.quiz_color")}.contrastText`,
                        backgroundColor: `${props?.watch("settings.quiz_color")}.main`
                      }
                    },
                    children: [
                      {
                        component: "MdQuiz",
                        component_name: "course_student_options_avatar_icon_quiz_count"
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_options_box_quiz_count",
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_quiz_count",
                        props: {
                          variant: "h4"
                        },
                        value: props?.watch("course")?.content_overview?.quiz || 0
                      },
                      {
                        component: "Typography",
                        component_name: "course_student_options_typography_quiz_label",
                        props: {
                          color: "text.secondary",
                          variant: "subtitle2",
                          component: "div"
                        },
                        value: __("Quiz count", "acadlix")
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

  const student_options = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course.course_student.student_options",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      props: props
    }
  ) ?? [];

  return (
    <>
      {student_options.map((field, i) => (
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

export default StudentOptions