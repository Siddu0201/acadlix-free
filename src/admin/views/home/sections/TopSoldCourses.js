import { Link, Paper } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { GetTopCoursesBySales } from '@acadlix/requests/admin/AdminHomeRequest';
import { useForm } from 'react-hook-form';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import { currencyPosition } from '@acadlix/helpers/util';

const TopSoldCourses = (props) => {
  const methods = useForm({
    defaultValues: {
      rows: [],
    }
  });
  const { data, isFetching } = GetTopCoursesBySales();

  React.useMemo(() => {
    if (data?.data?.top_courses) {
      methods.setValue('rows', data.data.top_courses, { shouldDirty: true });
    }
  }, [data]);

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }

  const defaultSetting = {
    component: "Card",
    component_name: "top_sold_courses_card",
    children: [
      {
        component: "CardContent",
        component_name: "top_sold_courses_card_content",
        children: [
          {
            component: "Box",
            component_name: "top_sold_courses_box",
            props: {
              sx: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              },
            },
            children: [
              {
                component: "Box",
                component_name: "top_sold_courses_inner_box",
                props: {
                  sx: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "top_sold_courses_title_typography",
                    props: {
                      variant: "h4",
                    },
                    value: __("Top Sold Courses", "acadlix"),
                  },
                  {
                    component: "Typography",
                    component_name: "top_sold_courses_subtitle_typography",
                    props: {
                      variant: "caption",
                      sx: {
                        color: (theme) => `${theme.palette.text.secondary}`
                      },
                    },
                    value: __("Manage and monitor your top sold courses.", "acadlix"),
                  }
                ]
              },
              {
                component: "Box",
                component_name: "top_sold_courses_button_box",
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
                    component_name: "top_sold_courses_view_courses_button",
                    props: {
                      variant: "outlined",
                      color: "primary",
                      component: Link,
                      href: props.watch('orderUrl'),
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                    value: __("View All Orders", "acadlix"),
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: "TableContainer",
        component_name: "top_sold_courses_table_container",
        props: {
          component: Paper,
        },
        children: [
          {
            component: "Table",
            component_name: "top_sold_courses_table",
            props: {
              sx: { minWidth: 650 },
              'aria-label': "simple table",
            },
            children: [
              {
                component: "TableHead",
                component_name: "top_sold_courses_table_head",
                props: {
                  sx: {
                    backgroundColor: "#f9fafc",
                  },
                },
                children: [
                  {
                    component: "TableRow",
                    component_name: "top_sold_courses_table_head_row",
                    children: [
                      {
                        component: "TableCell",
                        component_name: "top_sold_courses_table_head_cell_course",
                        props: {
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Course", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "top_sold_courses_table_head_cell_one_time",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("One Time", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "top_sold_courses_table_head_cell_total_sales",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Total Sales", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "top_sold_courses_table_head_cell_action",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Action", "acadlix"),
                      }
                    ]
                  }
                ]
              },
              {
                component: "TableBody",
                component_name: "top_sold_courses_table_body",
                children: methods.watch('rows')?.map((row) => {
                  return (
                    {
                      component: "TableRow",
                      component_name: "top_sold_courses_table_body_row",
                      props: {
                        sx: { '&:last-child td, &:last-child th': { border: 0 } },
                      },
                      children: [
                        {
                          component: "TableCell",
                          component_name: "top_sold_courses_table_body_cell_course",
                          props: {
                            component: "th",
                            scope: "row",
                          },
                          children: [
                            {
                              component: "Box",
                              component_name: "top_sold_courses_table_body_cell_course_box",
                              props: {
                                sx: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }
                              },
                              children: [
                                {
                                  component: "Avatar",
                                  component_name: "top_sold_courses_table_body_cell_course_avatar",
                                  props: {
                                    src: row.course?.thumbnail?.url || acadlixOptions?.default_img_url || "",
                                    alt: row.course_name,
                                    sx: {
                                      width: 96,
                                      height: 60,
                                    },
                                    variant: "rounded"
                                  },
                                },
                                {
                                  component: "Typography",
                                  component_name: "top_sold_courses_table_body_cell_course_name",
                                  props: {
                                    variant: "body2",
                                  },
                                  value: row.course_name,
                                }
                              ]
                            }
                          ],
                        },
                        {
                          component: "TableCell",
                          component_name: "top_sold_courses_table_body_cell_one_time",
                          props: {
                            align: "center",
                            sx: {
                              fontWeight: `400 !important`,
                            },
                          },
                          value: row.one_time_sales,
                        },
                        {
                          component: "TableCell",
                          component_name: "top_sold_courses_table_body_cell_total_sales",
                          props: {
                            align: "center",
                          },
                          value: currencyPosition(row.total_sales_amount),
                        },
                        {
                          component: "TableCell",
                          component_name: "top_sold_courses_table_body_cell_action",
                          props: {
                            align: "center",
                          },
                          children: [
                            {
                              component: "Button",
                              component_name: "top_sold_courses_table_body_cell_action_button",
                              props: {
                                color: "primary",
                                size: "small",
                                component: Link,
                                href: `${props?.watch('courseStudentUrl')}&course_id=${row.course_id}`,
                                target: "_blank",
                                rel: "noopener noreferrer",
                              },
                              value: __("View", "acadlix"),
                            }
                          ]
                        }
                      ]
                    }
                  )
                })
              }
            ]
          }
        ]
      }
    ]
  };

  const top_sold_courses = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.top_sold_courses",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
      props: props,
      data: data,
      isFetching: isFetching,
    }
  ) ?? [];

  return (
    <>
      {top_sold_courses.map((field, i) => (
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

export default TopSoldCourses;