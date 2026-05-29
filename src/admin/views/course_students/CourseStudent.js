import { Link, Paper, TablePagination } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { TiArrowLeftThick } from '@acadlix/helpers/icons'
import { useForm } from 'react-hook-form'
import { GetCourseStudentData } from '@acadlix/requests/admin/AdminCourseRequest'
import StudentList from './sections/StudentList'
import CourseProfile from './sections/CourseProfile'
import { CourseStudentFunction } from './CourseStudentFuntion'
import StudentOptions from './sections/StudentOptions'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const CourseStudent = ({ courseId }) => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminCourseStudentPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminCourseStudentPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const baseSettings = {
    course_id: courseId,
    student_count: 0,
    students: [],
    course: {},
    settings: {
      lesson_color: 'success',
      quiz_color: 'warning',
    },
  };

  const filteredSettings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course.course_student.base_settings",
    baseSettings,
    {
      courseId: courseId,
    }
  ) ?? baseSettings;

  const methods = useForm({
    defaultValues: filteredSettings,
  });
  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }

  let availableType = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course.course_student.available_type",
    [
      'lesson',
      'quiz',
    ],
    {
      courseId: courseId,
    }
  ) ?? [
      'lesson',
      'quiz',
    ];

  const {
    getTotalCompletedCourse,
    getTotalInProgressCourse,
  } = CourseStudentFunction(methods);

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const { isFetching, data, refetch } = GetCourseStudentData(
    courseId,
    paginationModel.page,
    paginationModel.pageSize
  );

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminCourseStudentPage', model.page);
    localStorage.setItem('adminCourseStudentPageSize', model.pageSize);
  };

  React.useEffect(() => {
    if (data?.data?.students?.length > 0) {
      methods?.setValue("student_count", data?.data?.students_count || 0);
      methods?.setValue(
        "students",
        data?.data?.students?.map((student) => {
          return window?.acadlixHooks?.applyFilters?.(
            "acadlix.admin.course.course_student.student_data",
            {
              id: student.ID,
              name: student.display_name,
              email: student.user_email,
              is_completed: student?.is_completed || false,
              statistic_overview: student?.statistic_overview || {},
              completion_percentage: student?.completion_percentage || 0,
              sections: data?.data?.course?.sections?.map((section) => {
                return {
                  id: section.ID,
                  contents: section?.contents?.map((content) => {
                    return {
                      id: content.ID,
                      contentable: content?.contentable,
                      is_completed: student?.course_statistics?.find((stat) => stat.course_section_content_id === content.ID)?.is_completed || false,
                      is_statistics_enabled: content?.contentable_data?.rendered_metas?.quiz_settings?.save_statistic ?? false,
                    }
                  }),
                }
              }),
            },
            {
              courseId: courseId,
              student: student,
              course: data?.data?.course || {},
              student_count: data?.data?.students_count || 0,
            }
          )
        }),
        {
          shouldDirty: true,
        }
      );
    }
    if (data?.data?.course) {
      methods?.setValue("course", data?.data?.course || {});
    }

  }, [data?.data]);

  const defaultSetting = {
    component: "Box",
    component_name: "course_student_box",
    children: [
      {
        component: "Grid",
        component_name: "course_student_grid_container",
        props: {
          container: true,
          spacing: {
            xs: 2,
            sm: 4,
          },
          sx: {
            padding: {
              xs: 2,
              sm: 4,
            }
          }
        },
        children: [
          {
            component: "Grid",
            component_name: "course_student_grid_item_back",
            props: {
              size: {
                xs: 12,
                lg: 12,
              }
            },
            children: [
              {
                component: "Box",
                component_name: "course_student_back_box",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }
                },
                children: [
                  {
                    component: "Button",
                    component_name: "course_student_back_button",
                    props: {
                      variant: "contained",
                      startIcon: <TiArrowLeftThick />,
                      size: "medium",
                      sx: {
                        width: "fit-content",
                      },
                      LinkComponent: Link,
                      href: acadlixOptions.acadlix_course_url,
                    },
                    value: __("Back", "acadlix")
                  }
                ]
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_student_grid_item_title",
            props: {
              size: {
                xs: 12,
                sm: 12,
              }
            },
            children: [
              {
                component: "Box",
                component_name: "course_student_title_box",
                props: {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "course_student_title_typography",
                    props: {
                      variant: "h3",
                    },
                    value: __("Course Students", "acadlix")
                  },
                  {
                    component: "CustomRefresh",
                    component_name: "course_student_refresh",
                    props: {
                      refetch: refetch,
                    }
                  }
                ]
              }
            ]
          },
          isFetching ?
            {
              component: "Grid",
              component_name: "course_student_grid_item_loader",
              props: {
                size: {
                  xs: 12,
                  sm: 12,
                }
              },
              children: [
                {
                  component: "Loader",
                  component_name: "course_student_loader",
                }
              ]
            }
            :
            {
              component: "Fragment",
              component_name: "course_student_data_fragment",
              children: [
                {
                  component: "Grid",
                  component_name: "course_student_grid_item_profile",
                  props: {
                    size: {
                      xs: 12,
                      sm: 12,
                    }
                  },
                  children: [
                    {
                      component: <CourseProfile {...methods} />,
                      component_name: "course_student_profile",
                    }
                  ]
                },
                {
                  component: "Grid",
                  component_name: "course_student_grid_item_options",
                  props: {
                    size: {
                      xs: 12,
                      sm: 12,
                    }
                  },
                  children: [
                    {
                      component: <StudentOptions
                        {...methods}
                        availableType={availableType}
                        getTotalCompletedCourse={getTotalCompletedCourse}
                        getTotalInProgressCourse={getTotalInProgressCourse}
                      />,
                      component_name: "course_student_options",
                    }
                  ]
                },
                {
                  component: "Grid",
                  component_name: "course_student_grid_item_table",
                  props: {
                    size: {
                      xs: 12,
                      sm: 12,
                    }
                  },
                  children: [
                    {
                      component: "TableContainer",
                      component_name: "course_student_table_container",
                      props: {
                        component: Paper,
                      },
                      children: [
                        {
                          component: "Table",
                          component_name: "course_student_table",
                          props: {
                            "aria-label": "collapsible table",
                          },
                          children: [
                            {
                              component: "TableHead",
                              component_name: "course_student_table_head",
                              children: [
                                {
                                  component: "TableRow",
                                  component_name: "course_student_table_row",
                                  children: [
                                    {
                                      component: "TableCell",
                                      component_name: "course_student_table_cell_empty",
                                    },
                                    {
                                      component: "TableCell",
                                      component_name: "course_student_table_cell_student_name",
                                      props: {
                                        align: "left",
                                      },
                                      value: __("Student name", "acadlix")
                                    },
                                    {
                                      component: "TableCell",
                                      component_name: "course_student_table_cell_lesson",
                                      value: __("Lesson", "acadlix")
                                    },
                                    {
                                      component: "TableCell",
                                      component_name: "course_student_table_cell_quiz",
                                      value: __("Quiz", "acadlix")
                                    },
                                    {
                                      component: "TableCell",
                                      component_name: "course_student_table_cell_progress",
                                      value: __("Progress", "acadlix")
                                    },
                                  ]
                                }
                              ]
                            },
                            {
                              component: "TableBody",
                              component_name: "course_student_table_body",
                              children: methods.watch("students")?.map((student, index) => {
                                return {
                                  component: <StudentList
                                    key={index}
                                    index={index}
                                    student={student}
                                    course={methods.watch("course")}
                                    availableType={availableType}
                                    {...methods}
                                  />
                                }
                              })
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  component: "Grid",
                  component_name: "course_student_grid_item_pagination",
                  props: {
                    size: {
                      xs: 12,
                      sm: 12,
                    },
                  },
                  children: [
                    {
                      component: "Box",
                      component_name: "course_student_pagination_box",
                      props: {
                        sx: {
                          display: "flex",
                          justifyContent: "center",
                          padding: 2,
                        }
                      },
                      children: [
                        {
                          component: <TablePagination
                            component="div"
                            count={methods?.watch("student_count") || 0}
                            page={paginationModel?.page}
                            onPageChange={(_, newPage) => handlePaginationChange({ ...paginationModel, page: newPage })}
                            rowsPerPage={paginationModel?.pageSize}
                            onRowsPerPageChange={(e) => {
                              const pageSize = parseInt(e?.target?.value);
                              const page = Math.min(paginationModel?.page, Math.floor(methods?.watch('students')?.length / pageSize)); // Ensure page does not exceed limit
                              handlePaginationChange({
                                pageSize: pageSize,
                                page: page,
                              });
                            }}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                            slotProps={{
                              selectLabel: {
                                component: "div",
                              },
                              displayedRows: {
                                component: "div",
                              },
                              actions: {
                                nextButton: {
                                  className: "acadlix-icon-btn",
                                },
                                previousButton: {
                                  className: "acadlix-icon-btn",
                                }
                              },
                            }}
                            sx={{
                              '& .MuiToolbar-root': {
                                paddingLeft: 0,
                                paddingRight: 0,
                              },
                              '& .MuiTablePagination-selectLabel': {
                                margin: 0,
                              },
                              '& .MuiTablePagination-displayedRows': {
                                margin: 0,
                              },
                              '& .MuiInputBase-root': {
                                marginX: 0,
                              },
                            }}
                          />
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

  const course_student = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course.course_student",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
    }
  ) ?? [];

  return (
    <>
      {course_student.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              setValue: methods?.setValue,
              watch: methods?.watch,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default CourseStudent