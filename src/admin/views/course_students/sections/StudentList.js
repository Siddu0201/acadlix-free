import React from 'react'
import LessonList from './lists/LessonList';
import QuizList from './lists/QuizList';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const StudentList = (props) => {
  const [open, setOpen] = React.useState(false);

  const defaultSetting = {
    component: "Fragment",
    component_name: "student_list_fragment",
    children: [
      {
        component: "TableRow",
        component_name: "course_student_table_row",
        props: {
          sx: {
            '& > *': { borderBottom: 'unset' },
            backgroundColor: (theme) => open ? theme.palette.grey[100] : 'inherit',
          },
          onClick: () => setOpen(!open),
        },
        children: [
          {
            component: "TableCell",
            component_name: "course_student_table_cell_expand",
            children: [
              {
                component: "IconButton",
                component_name: "course_student_expand_icon_button",
                props: {
                  "aria-label": "expand row",
                  size: "small",
                },
                children: [
                  {
                    component: open ? "IoIosArrowUp" : "IoIosArrowDown",
                    component_name: "course_student_expand_icon",
                  }
                ]
              }
            ]
          },
          {
            component: "TableCell",
            component_name: "course_student_table_cell_name",
            props: {
              component: "th",
              scope: "row",
            },
            children: [
              {
                component: "Typography",
                component_name: "course_student_typography_name",
                props: {
                  variant: "h6",
                },
                value: props?.student?.name || props?.student?.user_email,
              }
            ]
          },
          {
            component: "TableCell",
            component_name: "course_student_table_cell_lessons",
            children: [
              {
                component: "Chip",
                component_name: "course_student_chip_lessons",
                props: {
                  label: `${props?.student?.statistic_overview?.completed_lessons || 0}/${props?.course?.content_overview?.lesson || 0}`,
                  variant: "filled",
                  color: props.watch("settings.lesson_color"),
                },
              }
            ]
          },
          {
            component: "TableCell",
            component_name: "course_student_table_cell_quizzes",
            children: [
              {
                component: "Chip",
                component_name: "course_student_chip_quizzes",
                props: {
                  label: `${props?.student?.statistic_overview?.completed_quizzes || 0}/${props?.course?.content_overview?.quiz || 0}`,
                  variant: "filled",
                  color: props.watch("settings.quiz_color"),
                },
              }
            ]
          },
          {
            component: "TableCell",
            component_name: "course_student_table_cell_progress",
            children: [
              {
                component: "Box",
                component_name: "course_student_progress_box",
                props: {
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
                children: [
                  {
                    component: "Box",
                    component_name: "course_student_progress_inner_box",
                    props: {
                      sx: {
                        width: '100%',
                        mr: 1,
                      },
                    },
                    children: [
                      {
                        component: "LinearProgress",
                        component_name: "course_student_linear_progress",
                        props: {
                          color: props?.student?.is_completed ? 'success' : 'primary',
                          variant: "determinate",
                          value: props?.student?.completion_percentage,
                        },
                      }
                    ]
                  },
                  {
                    component: "Box",
                    component_name: "course_student_progress_percentage_box",
                    props: {
                      sx: {
                        minWidth: 35,
                      },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "course_student_progress_percentage_typography",
                        props: {
                          variant: "body2",
                          sx: {
                            color: 'text.secondary',
                          },
                        },
                        value: `${Math.round(props?.student?.completion_percentage)}%`,
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
        component: "TableRow",
        component_name: "course_student_collapse_table_row",
        children: [
          {
            component: "TableCell",
            props: {
              sx: {
                paddingBottom: 0,
                paddingTop: 0,
              },
              colSpan: 4 + props?.availableType?.length,
            },
            children: [
              {
                component: "Collapse",
                component_name: "course_student_collapse",
                props: {
                  in: open,
                  timeout: "auto",
                  unmountOnExit: true,
                },
                children: [
                  {
                    component: "Box",
                    component_name: "course_student_collapse_box",
                    props: {
                      sx: {
                        marginTop: 4,
                      },
                    },
                    children: [
                      {
                        component: "Grid",
                        component_name: "course_student_grid_container",
                        props: {
                          container: true,
                          spacing: { xs: 2, sm: 4 },
                        },
                        children: [
                          props?.student?.sections?.reduce((total, section) => {
                            return total + section?.contents?.filter((content) => content?.contentable?.type === "lesson").length;
                          }, 0) > 0 && (
                            {
                              component: "Grid",
                              component_name: "course_student_grid_item_lessons",
                              props: {
                                size: { xs: 12, sm: 6, lg: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length },
                              },
                              children: [
                                {
                                  component: <LessonList
                                    {...props}
                                  />,
                                  component_name: "course_student_lesson_list",
                                }
                              ]
                            }
                          ),
                          props?.student?.sections?.reduce((total, section) => {
                            return total + section?.contents?.filter((content) => content?.contentable?.type === "quiz").length;
                          }
                            , 0) > 0 && (
                            {
                              component: "Grid",
                              component_name: "course_student_grid_item_quizzes",
                              props: {
                                size: {
                                  xs: 12,
                                  sm: 6,
                                  lg: 12 / props?.availableType?.length < 3 ? 3 : 12 / props?.availableType?.length
                                },
                              },
                              children: [
                                {
                                  component: <QuizList
                                    {...props}
                                  />,
                                  component_name: "course_student_quiz_list",
                                }
                              ]
                            }
                          )
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

  const student_list = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course_student.student_list",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      props: props,
    }
  ) ?? [];

  return (
    <>
      {student_list.map((field, i) => (
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

export default StudentList