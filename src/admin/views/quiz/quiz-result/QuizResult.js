import React from "react";
import {
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  FaTrash,
  TiArrowLeftThick,
  FaSearch
} from "@acadlix/helpers/icons";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  DeleteStatisticById,
  GetStatisticByQuizId,
  PostResetStatisticByQuizId,
} from "@acadlix/requests/admin/AdminStatisticRequest";
import dateFormat from "dateformat";
import { __, sprintf } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import toast from "react-hot-toast";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const ViewAnswerSheetButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_view_answer_sheet_button" */
      "@acadlix/pro/admin/quiz/quiz-result/ViewAnswerSheetButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_view_answer_sheet_button" */
      "@acadlix/free/admin/quiz/quiz-result/ViewAnswerSheetButton"
    )
)

const QuizResult = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminQuizResultPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminQuizResultPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      title: "",
      rows: [],
      question_count: 0,
      pass_count: 0,
      fail_count: 0,
      attempt_counts: 0,
      statistic_ref_ids: [],
      action: "",
    },
  });

  const resetStatistic = PostResetStatisticByQuizId(quiz_id);
  const handleResetStatistic = () => {
    if (confirm(__("Do you really want to reset this statistic?", "acadlix"))) {
      resetStatistic?.mutate({}, {
        onSuccess: (data) => {
          toast.success(__('Result successfully reset.', 'acadlix'));
        }
      });
    }
  };

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteStatisticById();
  const deleteStatisticById = (id) => {
    if (confirm(__("Do you really want to delete this result?", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  };

  const columns = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.quiz_result.columns",
    [
      { field: "id", headerName: __("ID", "acadlix") },
      { field: "name", headerName: __("Name / Username", "acadlix"), flex: 2, minWidth: 200 },
      { field: "date", headerName: __("Date/Time", "acadlix"), flex: 1, minWidth: 150 },
      { field: "score", headerName: __("Score", "acadlix"), flex: 1, minWidth: 100 },
      { field: "percentage", headerName: __("Percentage", "acadlix"), flex: 1, minWidth: 100 },
      {
        field: "status",
        headerName: __("Status", "acadlix"),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          return (
            <>
              {
                params?.value === "Pass" &&
                <Chip
                  color="success"
                  label={__('Pass', 'acadlix')}
                />
              }
              {
                params?.value === "Fail" &&
                <Chip
                  color="error"
                  label={__('Fail', 'acadlix')}
                />
              }
              {
                params?.value === "NA" &&
                <Chip
                  color="grey"
                  label={__('NA', 'acadlix')}
                />
              }
            </>
          );
        },
      },
      {
        field: "action",
        headerName: __("Action", "acadlix"),
        sortable: false,
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const actionSetting = {
            component: "Box",
            component_name: "quiz_result_action_box",
            children: [
              hasCapability("acadlix_show_answersheet") && {
                component: "Suspense",
                component_name: "quiz_result_action_answer_sheet_suspense",
                props: {
                  fallback: null,
                },
                children: [
                  {
                    component: <ViewAnswerSheetButton
                      quiz_id={quiz_id}
                      id={params?.id}
                    />,
                    component_name: "quiz_result_action_view_answer_sheet_button",
                  },
                ],
              },
              hasCapability("acadlix_delete_statistic") && {
                component: "Tooltip",
                component_name: "quiz_result_action_delete_tooltip",
                props: {
                  title: __("Delete", "acadlix"),
                },
                children: [
                  {
                    component: "IconButton",
                    component_name: "quiz_result_action_delete_icon_button",
                    props: {
                      size: "small",
                      color: "error",
                      onClick: deleteStatisticById.bind(this, params?.id),
                    },
                    children: [
                      {
                        component: "FaTrash",
                        component_name: "quiz_result_action_delete_icon",
                        props: {
                          fontSize: "inherit",
                        },
                      },
                    ],
                  },
                ],
              },
            ]
          }

          const actionElements = window?.acadlixHooks?.applyFilters(
            "acadlix.admin.quiz_result.actions",
            [actionSetting],
            {
              register: methods?.register,
              control: methods?.control,
              watch: methods?.watch,
              setValue: methods?.setValue,
              params: params,
              quiz_id: quiz_id,
            }
          ) ?? [];
          return (
            <>
              {actionElements.map((field, i) => (
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
          // return (
          //   <Box>
          //     {
          //       hasCapability("acadlix_show_answersheet") &&
          //       <React.Suspense fallback={null}>
          //         <ViewAnswerSheetButton
          //           quiz_id={quiz_id}
          //           id={params?.id}
          //         />
          //       </React.Suspense>
          //     }
          //     {
          //       hasCapability("acadlix_delete_statistic") &&
          //       <Tooltip title={__("Delete", "acadlix")}>
          //         <IconButton
          //           aria-label="delete"
          //           size="small"
          //           color="error"
          //           sx={{ ml: 1 }}
          //           onClick={deleteStatisticById.bind(this, params?.id)}
          //         >
          //           <FaTrash fontSize="inherit" />
          //         </IconButton>
          //       </Tooltip>
          //     }
          //   </Box>
          // );
        },
      },
    ]);

  const { data, isFetching, refetch } = GetStatisticByQuizId(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search"),
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return window?.acadlixHooks?.applyFilters(
          "acadlix.admin.quiz_result.row",
          {
            id: stat_ref?.id,
            name: stat_ref?.user ? `${stat_ref?.user?.display_name} (${stat_ref?.user?.user_login})` : __("Anonymous", "acadlix"),
            date: dateFormat(stat_ref?.created_at, "mmm dd, yyyy hh:MM:ss TT"),
            score: stat_ref?.points?.toFixed(2),
            percentage: stat_ref?.result?.toFixed(2),
            status: stat_ref?.status ?? "NA",
          },
          {
            stat_ref: stat_ref,
            quiz_id: quiz_id,
          }
        );
      });
      methods.setValue("rows", newRows, { shouldDirty: true });
    }
    if (data?.data?.quiz) {
      methods.setValue("question_count", data?.data?.quiz?.questions_count, { shouldDirty: true });
      methods.setValue("title", data?.data?.quiz?.post_title, { shouldDirty: true });
    }
    methods?.setValue("pass_count", data?.data?.pass_count, { shouldDirty: true });
    methods?.setValue("fail_count", data?.data?.fail_count, { shouldDirty: true });
    methods?.setValue("attempt_counts", data?.data?.total, { shouldDirty: true });
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handleSearch = (e) => {
    methods?.setValue("search", e?.target?.value, { shouldDirty: true });
  }

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminQuizResultPage', model.page);
    localStorage.setItem('adminQuizResultPageSize', model.pageSize);
  };

  const defaultSetting = {
    component: "Box",
    component_name: "admin_quiz_result_box",
    children: [
      {
        component: "Grid",
        component_name: "admin_quiz_result_grid",
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
            },
          }
        },
        children: [
          {
            component: "Grid",
            component_name: "admin_quiz_result_header_grid_item",
            props: {
              size: {
                xs: 12,
                lg: 12,
              },
            },
            children: [
              {
                component: "Box",
                component_name: "admin_quiz_result_header_box",
                props: {
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                },
                children: [
                  {
                    component: "Button",
                    component_name: "admin_quiz_result_header_back_button",
                    props: {
                      variant: "contained",
                      startIcon: <TiArrowLeftThick />,
                      size: "medium",
                      sx: {
                        width: "fit-content",
                      },
                      LinkComponent: Link,
                      to: `/`,
                    },
                    value: __('Back', 'acadlix'),
                  },
                  {
                    component: "Button",
                    component_name: "admin_quiz_result_header_reset_button",
                    props: {
                      variant: "contained",
                      size: "medium",
                      sx: {
                        width: "fit-content",
                        display: hasCapability("acadlix_reset_statistic") ? "block" : "none",
                      },
                      onClick: handleResetStatistic,
                    },
                    value: __('Reset Statistics', 'acadlix'),
                  },
                ],
              }
            ]
          },
          {
            component: "Grid",
            component_name: "admin_quiz_result_content_grid_item",
            props: {
              size: {
                xs: 12,
                lg: 12,
              },
            },
            children: [
              {
                component: "Card",
                component_name: "admin_quiz_result_content_card",
                children: [
                  {
                    component: "CardHeader",
                    component_name: "admin_quiz_result_content_card_header",
                    props: {
                      title: {
                        component: "Box",
                        props: {
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        },
                        children: [
                          {
                            component: "Typography",
                            props: {
                              variant: "h3",
                            },
                            value: sprintf(
                              /* translators: %s is the quiz title */
                              __("Statistics (%s)", "acadlix"),
                              methods?.watch("title")
                            ),
                          },
                          {
                            component: "CustomRefresh",
                            props: {
                              refetch: refetch,
                            },
                          },
                        ],
                      }
                    },
                  },
                  {
                    component: "CardContent",
                    component_name: "admin_quiz_result_content_card_content",
                    children: [
                      {
                        component: "Box",
                        component_name: "admin_quiz_result_content_card_content_box",
                        props: {
                          sx: {
                            width: isMobile ? "90%" : "100%",
                            mb: "20px",
                          }
                        },
                        children: [
                          {
                            component: "Grid",
                            component_name: "admin_quiz_result_card_content_box_grid",
                            props: {
                              container: true,
                              spacing: isMobile ? 2 : 3,
                            },
                            children: [
                              {
                                component: "Grid",
                                component_name: "admin_quiz_result_question_grid_item",
                                props: {
                                  size: {
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                  },
                                },
                                children: [
                                  {
                                    component: "Paper",
                                    component_name: "admin_quiz_result_question_paper",
                                    props: {
                                      sx: {
                                        p: 2,
                                        bgcolor: "primary.main",
                                        borderRadius: 2,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Typography",
                                        component_name: "admin_quiz_result_question_paper_typography",
                                        props: {
                                          variant: "body1",
                                          sx: {
                                            color: 'primary.contrastText'
                                          }
                                        },
                                        value: `${isMobile ? __("Qs:", "acadlix") : __("Questions:", "acadlix")} ${methods?.watch("question_count") ?? 0}`,
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                component: "Grid",
                                component_name: "admin_quiz_result_pass_grid_item",
                                props: {
                                  size: {
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                  },
                                },
                                children: [
                                  {
                                    component: "Paper",
                                    component_name: "admin_quiz_result_pass_paper",
                                    props: {
                                      sx: {
                                        p: 2,
                                        bgcolor: "success.main",
                                        color: "success.contrastText",
                                        borderRadius: 2,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Typography",
                                        component_name: "admin_quiz_result_pass_paper_typography",
                                        props: {
                                          variant: "body1",
                                          sx: {
                                            color: 'success.contrastText'
                                          }
                                        },
                                        value: `${__("Pass", "acadlix")} ${methods?.watch("pass_count") ?? 0}`,
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                component: "Grid",
                                component_name: "admin_quiz_result_fail_grid_item",
                                props: {
                                  size: {
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                  },
                                },
                                children: [
                                  {
                                    component: "Paper",
                                    component_name: "admin_quiz_result_fail_paper",
                                    props: {
                                      sx: {
                                        p: 2,
                                        bgcolor: "error.main",
                                        borderRadius: 2,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Typography",
                                        component_name: "admin_quiz_result_fail_paper_typography",
                                        props: {
                                          variant: "body1",
                                          sx: {
                                            color: 'error.contrastText'
                                          }
                                        },
                                        value: `${__("Fail", "acadlix")} ${methods?.watch("fail_count") ?? 0}`,
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                component: "Grid",
                                component_name: "admin_quiz_result_total_grid_item",
                                props: {
                                  size: {
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                  },
                                },
                                children: [
                                  {
                                    component: "Paper",
                                    component_name: "admin_quiz_result_total_paper",
                                    props: {
                                      sx: {
                                        p: 2,
                                        bgcolor: "warning.main",
                                        borderRadius: 2,
                                      },
                                    },
                                    children: [
                                      {
                                        component: "Typography",
                                        component_name: "admin_quiz_result_total_paper_typography",
                                        props: {
                                          variant: "body1",
                                          sx: {
                                            color: 'warning.contrastText'
                                          }
                                        },
                                        value: `${__("Total Attempt:", "acadlix")} ${methods?.watch("attempt_counts") ?? 0}`,
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                component: "Grid",
                                component_name: "admin_quiz_result_action_grid_item",
                                props: {
                                  size: {
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                  }
                                },
                                children: [
                                  {
                                    component: "Box",
                                    component_name: "admin_quiz_result_action_box",
                                    props: {
                                      sx: {
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center"
                                      },
                                    },
                                    children: [
                                      {
                                        component: "CustomTextField",
                                        component_name: "admin_quiz_result_action_box_textfield",
                                        props: {
                                          ...methods?.register("search"),
                                          size: "small",
                                          label: __("Search", "acadlix"),
                                          name: "search",
                                          // value: methods?.watch("search") ?? "",
                                          onChange: handleSearch,
                                          type: "search",
                                          slotProps: {
                                            input: {
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <FaSearch />
                                                </InputAdornment>
                                              )
                                            }
                                          }
                                        },
                                      },
                                    ]
                                  },
                                ]
                              }
                            ],
                          },
                        ]
                      },
                      {
                        component: "Box",
                        component_name: "admin_quiz_result_datagrid_box",
                        props: {
                          sx: {
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",

                          }
                        },
                        children: [
                          {
                            component: "DataGrid",
                            component_name: "admin_quiz_result_datagrid",
                            props: {
                              rows: methods?.watch("rows"),
                              columns: columns,
                              rowCount: rowCount,
                              paginationModel: paginationModel,
                              onPaginationModelChange: handlePaginationChange,
                              paginationMode: "server",
                              pageSizeOptions: [10, 25, 50],
                              checkboxSelection: true,
                              disableRowSelectionOnClick: true,
                              disableColumnMenu: true,
                              onRowSelectionModelChange: (data) => {
                                methods?.setValue("statistic_ref_ids", data, {
                                  shouldDirty: true,
                                });
                              },
                              rowSelectionModel: methods?.watch("statistic_ref_ids"),
                              loading: isFetching || deleteMutation?.isPending,
                              columnVisibilityModel: {
                                id: false,
                              },
                              sx: {
                                "& .PrivateSwitchBase-input": {
                                  height: "100% !important",
                                  width: "100% !important",
                                  margin: "0 !important",
                                }
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ]
          }
        ]
      }
    ]
  }

  const quiz_result_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.quiz.quiz_result",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
      quiz_id: quiz_id,
    }
  ) ?? [];

  return (
    <>
      {quiz_result_setting.map((field, i) => (
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

  // return (
  //   <Box>
  //     <Grid
  //       container
  //       spacing={{ xs: 2, sm: 4 }}
  //       sx={{
  //         padding: {
  //           xs: 2,
  //           sm: 4,
  //         },
  //       }}
  //     >
  //       <Grid size={{ xs: 12, lg: 12 }}>
  //         <Button
  //           variant="contained"
  //           startIcon={<TiArrowLeftThick />}
  //           size="medium"
  //           sx={{
  //             width: "fit-content",
  //           }}
  //           LinkComponent={Link}
  //           to={`/`}
  //         >
  //           {__('Back', 'acadlix')}
  //         </Button>
  //         {
  //           hasCapability("acadlix_reset_statistic") &&
  //           <Button
  //             variant="contained"
  //             size="medium"
  //             sx={{
  //               width: "fit-content",
  //               marginLeft: "1rem",
  //             }}
  //             onClick={handleResetStatistic}
  //           >
  //             {__('Reset Statistics', 'acadlix')}
  //           </Button>
  //         }
  //       </Grid>
  //       <Grid size={{ xs: 12, lg: 12 }}>
  //         <Card>
  //           <CardHeader
  //             title={
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   gap: 2,
  //                 }}
  //               >
  //                 <Typography
  //                   variant="h3"
  //                 >
  //                   {sprintf(
  //                     /* translators: %s is the quiz title */
  //                     __("Statistics (%s)", "acadlix"),
  //                     methods?.watch("title")
  //                   )}
  //                 </Typography>
  //                 <CustomRefresh
  //                   refetch={refetch}
  //                 />
  //               </Box>
  //             }
  //           />
  //           <CardContent>
  //             {/* Details Section */}
  //             <Box
  //               width={isMobile ? "90%" : "100%"}
  //               sx={{ marginBottom: "20px" }}
  //             >
  //               <Grid container spacing={isMobile ? 2 : 3}>
  //                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //                   <Paper
  //                     sx={{
  //                       p: 2,
  //                       bgcolor: "primary.main",
  //                       borderRadius: 2,
  //                     }}
  //                   >
  //                     <Typography
  //                       variant="body1"
  //                       sx={{
  //                         color: 'primary.contrastText'
  //                       }}
  //                     >
  //                       {`${isMobile ? __("Qs:", "acadlix") : __("Questions:", "acadlix")} ${methods?.watch("question_count")}`}
  //                     </Typography>
  //                   </Paper>
  //                 </Grid>
  //                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //                   <Paper
  //                     sx={{
  //                       p: 2,
  //                       bgcolor: "success.main",
  //                       color: "white",
  //                       borderRadius: 2,
  //                     }}
  //                   >
  //                     <Typography
  //                       variant="body1"
  //                       sx={{
  //                         color: 'success.contrastText'
  //                       }}
  //                     >
  //                       {__("Pass:", "acadlix")} {methods?.watch("pass_count")}
  //                     </Typography>
  //                   </Paper>
  //                 </Grid>
  //                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //                   <Paper
  //                     sx={{
  //                       p: 2,
  //                       bgcolor: "error.main",
  //                       borderRadius: 2,
  //                     }}
  //                   >
  //                     <Typography
  //                       variant="body1"
  //                       sx={{
  //                         color: 'error.contrastText'
  //                       }}
  //                     >
  //                       {__("Fail:", "acadlix")} {methods?.watch("fail_count")}
  //                     </Typography>
  //                   </Paper>
  //                 </Grid>
  //                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
  //                   <Paper
  //                     sx={{
  //                       p: 2,
  //                       bgcolor: "warning.main",
  //                       color: "white",
  //                       borderRadius: 2,
  //                     }}
  //                   >
  //                     <Typography
  //                       variant="body1"
  //                       sx={{
  //                         color: 'warning.contrastText'
  //                       }}
  //                     >
  //                       {__("Total Attempt:", "acadlix")} {methods?.watch("attempt_counts")}
  //                     </Typography>
  //                   </Paper>
  //                 </Grid>
  //                 <Grid size={{ xs: 12, sm: 12, md: 12 }}>
  //                   <Box sx={{
  //                     display: "flex",
  //                     justifyContent: "flex-end",
  //                     alignItems: "center"
  //                   }}>
  //                     <CustomTextField
  //                       size="small"
  //                       label={__("Search", "acadlix")}
  //                       helperText={__("Search by username", "acadlix")}
  //                       name="search"
  //                       value={methods?.watch("search") ?? ""}
  //                       onChange={handleSearch}
  //                       type="search"
  //                       slotProps={{
  //                         input: {
  //                           endAdornment: (
  //                             <InputAdornment position="end">
  //                               <FaSearch />
  //                             </InputAdornment>
  //                           )
  //                         }
  //                       }}
  //                     />
  //                   </Box>
  //                 </Grid>
  //               </Grid>
  //             </Box>

  //             <Box sx={{
  //               width: "100%",
  //               display: 'flex',
  //               flexDirection: 'column',
  //             }}>
  //               <DataGrid
  //                 rows={methods.watch("rows")}
  //                 columns={columns}
  //                 rowCount={rowCount}
  //                 paginationModel={paginationModel}
  //                 onPaginationModelChange={handlePaginationChange}
  //                 paginationMode="server"
  //                 pageSizeOptions={[10, 20, 50]}
  //                 checkboxSelection
  //                 disableRowSelectionOnClick
  //                 disableColumnMenu
  //                 onRowSelectionModelChange={(data) => {
  //                   methods?.setValue("statistic_ref_ids", data, {
  //                     shouldDirty: true,
  //                   });
  //                 }}
  //                 rowSelectionModel={methods?.watch("statistic_ref_ids")}
  //                 loading={isFetching || deleteMutation?.isPending}
  //                 columnVisibilityModel={{
  //                   id: false,
  //                 }}
  //                 sx={{
  //                   "& .PrivateSwitchBase-input": {
  //                     height: "100% !important",
  //                     width: "100% !important",
  //                     margin: "0 !important",
  //                   },
  //                 }}
  //               />
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );
};

export default QuizResult;
