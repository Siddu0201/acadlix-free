import { Box, Button, Card, CardContent, CardHeader, Chip, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { GetCourseOverviewData } from '@acadlix/requests/admin/AdminHomeRequest';
import { useForm } from 'react-hook-form';
import { currencyPosition } from '@acadlix/helpers/util';
import CustomRating from '@acadlix/components/CustomRating';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const CourseOverview = (props) => {
  const methods = useForm({
    defaultValues: {
      rows: [],
    }
  });
  const { data, isFetching } = GetCourseOverviewData();

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
    component_name: "course_overview_card",
    children: [
      {
        component: "CardContent",
        component_name: "course_overview_card_content",
        children: [
          {
            component: "Box",
            component_name: "course_overview_box",
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
                component_name: "course_overview_inner_box",
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
                    component_name: "course_overview_title_typography",
                    props: {
                      variant: "h4",
                    },
                    value: __("Course Overview", "acadlix"),
                  },
                  {
                    component: "Typography",
                    component_name: "course_overview_subtitle_typography",
                    props: {
                      variant: "caption",
                      sx: {
                        color: (theme) => `${theme.palette.text.secondary}`
                      },
                    },
                    value: __("Manage and monitor your most important courses.", "acadlix"),
                  }
                ]
              },
              {
                component: "Box",
                component_name: "course_overview_button_box",
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
                    component_name: "course_overview_view_courses_button",
                    props: {
                      variant: "outlined",
                      color: "primary",
                      component: Link,
                      href: props.watch('courseUrl'),
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                    value: __("View All Courses", "acadlix"),
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: "TableContainer",
        component_name: "course_overview_table_container",
        props: {
          component: Paper,
        },
        children: [
          {
            component: "Table",
            component_name: "course_overview_table",
            props: {
              sx: { minWidth: 650 },
              'aria-label': "simple table",
            },
            children: [
              {
                component: "TableHead",
                component_name: "course_overview_table_head",
                props: {
                  sx: {
                    backgroundColor: "#f9fafc",
                  },
                },
                children: [
                  {
                    component: "TableRow",
                    component_name: "course_overview_table_head_row",
                    children: [
                      {
                        component: "TableCell",
                        component_name: "course_overview_table_head_cell_course",
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
                        component_name: "course_overview_table_head_cell_students",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Students", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "course_overview_table_head_cell_rating",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Rating", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "course_overview_table_head_cell_revenue",
                        props: {
                          align: "center",
                          sx: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.secondary,
                          },
                        },
                        value: __("Revenue", "acadlix"),
                      },
                      {
                        component: "TableCell",
                        component_name: "course_overview_table_head_cell_action",
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
                component_name: "course_overview_table_body",
                children: methods.watch('rows')?.map((row) => {
                  return (
                    {
                      component: "TableRow",
                      component_name: "course_overview_table_body_row",
                      props: {
                        key: row.ID,
                        sx: { '&:last-child td, &:last-child th': { border: 0 } },
                      },
                      children: [
                        {
                          component: "TableCell",
                          component_name: "course_overview_table_body_cell_course",
                          props: {
                            component: "th",
                            scope: "row",
                          },
                          value: row.course_name,
                        },
                        {
                          component: "TableCell",
                          component_name: "course_overview_table_body_cell_students",
                          props: {
                            align: "center",
                            sx: {
                              fontWeight: `400 !important`,
                            },
                          },
                          value: row.total_users,
                        },
                        {
                          component: "TableCell",
                          component_name: "course_overview_table_body_cell_rating",
                          props: {
                            align: "center",
                          },
                          children: [
                            {
                              component: "CustomRating",
                              component_name: "course_overview_table_body_cell_rating_custom_rating",
                              props: {
                                value: row.average_rating,
                                fontSize: 20,
                                style: { marginRight: 8 },
                              },
                            }
                          ]
                        },
                        {
                          component: "TableCell",
                          component_name: "course_overview_table_body_cell_revenue",
                          props: {
                            align: "center",
                            sx: {
                              fontWeight: `400 !important`,
                            },
                          },
                          value: currencyPosition(row.total_revenue),
                        },
                        {
                          component: "TableCell",
                          component_name: "course_overview_table_body_cell_action",
                          props: {
                            align: "center",
                          },
                          children: [
                            {
                              component: "Button",
                              component_name: "course_overview_table_body_cell_action_button",
                              props: {
                                color: "primary",
                                size: "small",
                                component: Link,
                                href: `${props?.watch('courseStudentUrl')}&course_id=${row.ID}`,
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

  const course_overview = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.course_overview",
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
      {course_overview.map((field, i) => (
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

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
          }}>
            <Typography
              variant="h4"
            >
              {__("Course Overview", "acadlix")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: (theme) => `${theme.palette.text.secondary}`
              }}
            >
              {__("Manage and monitor your most important courses.", "acadlix")}
            </Typography>
          </Box>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={props.watch('courseUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {__("View All Courses", "acadlix")}
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{
              backgroundColor: "#f9fafc",
            }}>
              <TableRow>
                <TableCell sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Course</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Students</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Rating</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Revenue</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {methods.watch('rows').map((row) => (
                <TableRow
                  key={row.ID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.course_name}
                  </TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: `400 !important`,
                  }}>{row.total_users}</TableCell>
                  <TableCell align="center">
                    <CustomRating
                      value={row.average_rating}
                      fontSize={20}
                      style={{ marginRight: 8 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: `400 !important`,
                  }}>{currencyPosition(row.total_revenue)}</TableCell>
                  <TableCell align="center">
                    <Button
                      color="primary"
                      size="small"
                    >
                      {__("View", "acadlix")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default CourseOverview