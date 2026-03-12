import * as React from "react";
import { FaExpandArrowsAlt } from "@acadlix/helpers/icons";
import {
  Box,
  Typography,
  useMediaQuery,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  CardHeader,
  Chip,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import { __ } from "@wordpress/i18n";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import { GetStatisticByUserId } from "@acadlix/requests/front/FrontStatisticRequest";
import { useNavigate } from "react-router-dom";
import CustomRefresh from "@acadlix/components/CustomRefresh";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import Loader from "@acadlix/components/Loader";

export default function Result() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('frontResultPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('frontResultPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      resstatistic_ref_idsult_ids: [],
    },
  });
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const columns = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.result.columns',
    [
      { field: "id", headerName: __("ID", "acadlix") },
      { field: "title", headerName: __("Title", "acadlix"), flex: 3, minWidth: 220 },
      { field: "date", headerName: __("Date & Time", "acadlix"), flex: 1, minWidth: 180 },
      {
        field: "score",
        headerName: __("Score", "acadlix"),
        flex: 1,
        minWidth: 100,
      },
      { field: "percentage", headerName: __("Percentage", "acadlix"), flex: 1, minWidth: 100 },
      {
        field: "status",
        headerName: __("Status", "acadlix"),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          return (
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}>
              {params?.value === "Pass" && <Chip
                color="success"
                label={__("Pass", "acadlix")}
              />}
              {params?.value === "Fail" && <Chip
                color="error"
                label={__("Fail", "acadlix")}
              />}
              {params?.value === "NA" && <Chip
                color="grey"
                label={__("NA", "acadlix")}
              />}
            </div>
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
          return (
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}>
              <Tooltip title={__("View Answersheet", "acadlix")} arrow>
                <IconButton
                  className="acadlix-icon-btn"
                  aria-label="expand"
                  size="small"
                  color="warning"
                  disabled={params?.row?.hide_answer_sheet}
                  onClick={() => navigate(`/result/${params?.id}`)}
                >
                  <FaExpandArrowsAlt fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    ]
  );

  const { data, isFetching, refetch } = GetStatisticByUserId(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize);

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return window.acadlixHooks?.applyFilters(
          'acadlix.front.dashboard.result.rows',
          {
            id: stat_ref?.id,
            title: stat_ref?.quiz?.post_title,
            date: dateFormat(stat_ref?.created_at, "mmm dd, yyyy hh:MM:ss TT"),
            score: stat_ref?.points?.toFixed(2),
            percentage: stat_ref?.result?.toFixed(2),
            status: stat_ref?.status ?? "NA",
            hide_answer_sheet: stat_ref?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet ?? false
          },
          {
            stat_ref: stat_ref,
          }
        );
      });
      methods.setValue("rows", newRows, { shouldDirty: true });
    }
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('frontResultPage', model.page);
    localStorage.setItem('frontResultPageSize', model.pageSize);
  };

  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card
            sx={{
              boxShadow: "none",
            }}
          >
            <CardHeader title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  component="div"
                  variant="h3"
                >
                  {__("My Result", "acadlix")}
                </Typography>
                <CustomRefresh
                  refetch={refetch}
                  sx={{
                    paddingY: 1.5,
                  }}
                />
              </Box>
            } />
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MobileOnlyView
                  {...methods}
                  isFetching={isFetching}
                  paginationModel={paginationModel}
                  handlePaginationChange={handlePaginationChange}
                  rowCount={rowCount}
                />
                {/* {
                  isMobile ? (
                    <MobileOnlyView
                      {...methods}
                      isFetching={isFetching}
                      paginationModel={paginationModel}
                      handlePaginationChange={handlePaginationChange}
                      rowCount={rowCount}
                    />
                  ) : (
                    <DataGrid
                      rows={methods?.watch("rows")}
                      columns={columns}
                      rowCount={rowCount}
                      paginationModel={paginationModel}
                      onPaginationModelChange={handlePaginationChange}
                      paginationMode="server"
                      pageSizeOptions={[10, 20, 50, 100]}
                      checkboxSelection
                      disableColumnMenu
                      disableRowSelectionOnClick
                      onRowSelectionModelChange={(data) => {
                        methods?.setValue("statistic_ref_ids", data, {
                          shouldDirty: true,
                        });
                      }}
                      rowSelectionModel={methods?.watch("statistic_ref_ids")}
                      loading={isFetching}
                      columnVisibilityModel={{
                        id: false,
                      }}
                      sx={{
                        "& .PrivateSwitchBase-input": {
                          height: "100% !important",
                          width: "100% !important",
                          margin: "0 !important",
                        },
                      }}
                    />
                  )
                } */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const MobileOnlyView = (props) => {
  const defaultSetting = {
    component: "Paper",
    component_name: "result_paper",
    props: {
      sx: {
        width: "100%",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      }
    },
    children: [
      {
        component: "Fragment",
        component_name: "result_fragment",
        children: props?.watch("rows")?.length > 0 ?
          props?.watch("rows")?.map((row, index) => {
            return {
              component: <SingleResult row={row} key={index} {...props} />,
              component_name: "result_content_item"
            }
          })
          : [{
            component: "Box",
            component_name: "result_box_no_data",
            props: {
              sx: {
                display: "flex",
                justifyContent: "center",
                padding: 2,
              }
            },
            children: [
              {
                component_name: "result_box_no_data_text",
                component: "Typography",
                props: {
                  component: "div",
                  variant: "h6",
                  sx: {
                    color: "text.secondary",
                  }
                },
                value: __("No Data Found", "acadlix")
              }
            ]
          }],
      },
      {
        component: "Box",
        props: {
          sx: {
            display: "flex",
            justifyContent: "center",
            padding: 1,
          }
        },
        children: [
          {
            component: "TablePagination",
            component_name: "result_table_pagination",
            props: {
              component: "div",
              count: props?.rowCount,
              page: props?.paginationModel?.page,
              onPageChange: (_, newPage) => props?.handlePaginationChange({ ...props?.paginationModel, page: newPage }),
              rowsPerPage: props?.paginationModel?.pageSize,
              onRowsPerPageChange: (e) => {
                const pageSize = parseInt(e?.target?.value);
                const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
                props?.handlePaginationChange({
                  pageSize: pageSize,
                  page: page,
                })
              },
              slotProps: {
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
              },
              sx: {
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
              },
            }
          }
        ]
      }
    ]
  }

  const resultMobile = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.result.mobile',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      handlePaginationChange: props?.handlePaginationChange,
      paginationModel: props?.paginationModel,
      isDesktop: false,
    }
  )?.filter(Boolean) || [];

  if (props?.isFetching) {
    return <Loader />;
  }

  return (
    <>
      {resultMobile.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            key={i}
            formProps={{
              register: props?.register,
              watch: props?.watch,
              setValue: props?.setValue,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )

  // return (
  //   <Paper style={{
  //     width: "100%",
  //     backgroundColor: "transparent",
  //     border: "none",
  //     boxShadow: "none"
  //   }} >
  //     {
  //       props?.isFetching ? (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "center",
  //             padding: 2,
  //           }}
  //         >
  //           <CircularProgress />
  //         </Box >
  //       ) : (
  //         props?.watch("rows")?.map((row, index) => {
  //           let color = "default";
  //           let label = "";
  //           if (row?.status === "Pass") {
  //             color = "success";
  //             label = __("Pass", "acadlix");
  //           } else if (row?.status === "Fail") {
  //             color = "error";
  //             label = __("Fail", "acadlix");
  //           } else if (row?.status === "NA") {
  //             color = "grey";
  //             label = __("NA", "acadlix");
  //           }
  //           return (
  //             <Box
  //               key={index}
  //               sx={{
  //                 padding: "8px",
  //                 marginTop: "8px",
  //                 marginBottom: "8px",
  //                 borderBottom: "1px solid #e0e0e0",
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 gap: "4px",
  //                 boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  //                 borderRadius: "8px",
  //                 backgroundColor: "white",
  //               }}
  //             >
  //               <Box
  //                 display="flex"
  //                 justifyContent="space-between"
  //                 alignItems="center"
  //               >
  //                 <Typography
  //                   variant="h6"
  //                   sx={{
  //                     fontSize: "14px",
  //                   }}
  //                 >
  //                   {row?.title}
  //                 </Typography>
  //                 <Tooltip title={__("View Answersheet", "acadlix")} arrow>
  //                   <IconButton
  //                     aria-label="expand"
  //                     size="small"
  //                     color="warning"
  //                     LinkComponent={Link}
  //                     to={`/result/${row?.id}`}
  //                     disabled={row?.hide_answer_sheet}
  //                   >
  //                     <FaExpandArrowsAlt fontSize="inherit" />
  //                   </IconButton>
  //                 </Tooltip>
  //               </Box>
  //               <Box display="flex" alignItems="center" gap="4px">
  //                 <HistoryToggleOff style={{ color: "gray" }} />
  //                 <Typography
  //                   variant="body2"
  //                   color="text.secondary"
  //                 >
  //                   {row?.date}
  //                 </Typography>
  //               </Box>
  //               <Box
  //                 display="flex"
  //                 justifyContent="space-between"
  //                 alignItems="center"
  //               >
  //                 <Typography
  //                   variant="body2"
  //                 >
  //                   {__("Score: ", "acadlix")}{row?.score}
  //                 </Typography>
  //                 <Chip
  //                   color={color}
  //                   label={label}
  //                 />
  //               </Box>
  //             </Box>
  //           )
  //         })
  //       )}

  //     <Box display="flex" justifyContent="center" padding={1}>
  //       <TablePagination
  //         component="div"
  //         count={props?.rowCount}
  //         page={props?.paginationModel?.page}
  //         onPageChange={(_, newPage) => props?.handlePaginationChange({ ...props?.paginationModel, page: newPage })}
  //         rowsPerPage={props?.paginationModel?.pageSize}
  //         onRowsPerPageChange={(e) => {
  //           const pageSize = parseInt(e?.target?.value);
  //           const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
  //           props?.handlePaginationChange({
  //             pageSize: pageSize,
  //             page: page,
  //           })
  //         }}
  //         sx={{
  //           '& .MuiToolbar-root': {
  //             paddingLeft: 0,
  //             paddingRight: 0,
  //           },
  //           '& .MuiTablePagination-selectLabel': {
  //             margin: 0,
  //           },
  //           '& .MuiTablePagination-displayedRows': {
  //             margin: 0,
  //           },
  //           '& .MuiInputBase-root': {
  //             marginX: 0,
  //           },
  //         }}
  //       />
  //       {/* <Stack spacing={2}> */}
  //       {/* <Pagination
  //           shape="rounded"
  //           count={Math.ceil(
  //             props?.watch("rows").length / props?.paginationModel?.pageSize
  //           )}
  //           page={props?.paginationModel?.page}
  //           onChange={(e, value) =>
  //             props?.setPaginationModel((p) => ({ ...p, page: value }))
  //           }
  //         /> */}
  //       {/* </Stack> */}
  //     </Box>
  //   </Paper >
  // );
};

const SingleResult = ({ row, ...props }) => {
  let color = "default";
  let label = "";
  if (row?.status === "Pass") {
    color = "success";
    label = __("Pass", "acadlix");
  } else if (row?.status === "Fail") {
    color = "error";
    label = __("Fail", "acadlix");
  } else if (row?.status === "NA") {
    color = "grey";
    label = __("NA", "acadlix");
  }

  const defaultSetting = {
    component: "Box",
    component_name: "single_result_box",
    props: {
      sx: {
        padding: "8px",
        marginTop: "8px",
        marginBottom: "8px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        backgroundColor: "white",
      },
    },
    children: [
      {
        component: "Box",
        component_name: "single_result_box_header",
        props: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        children: [
          {
            component: "Typography",
            component_name: "single_result_box_header_typography",
            props: {
              component: "div",
              variant: "h6",
              sx: {
                fontSize: "14px",
              },
            },
            value: row?.title,
          },
          {
            component: "Tooltip",
            component_name: "single_result_box_header_tooltip",
            props: {
              title: __("View Answersheet", "acadlix"),
              arrow: true,
            },
            children: [
              {
                component: "IconButton",
                component_name: "single_result_box_header_tooltip_iconbutton",
                props: {
                  className: "acadlix-icon-btn",
                  size: "small",
                  color: "warning",
                  LinkComponent: Link,
                  to: `/result/${row?.id}`,
                  disabled: row?.hide_answer_sheet,
                },
                children: [
                  {
                    component: "FaExpandArrowsAlt",
                    component_name: "single_result_box_header_tooltip_iconbutton_icon",
                    props: {
                      fontSize: "inherit",
                    },
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        component: "Box",
        component_name: "single_result_box_date",
        props: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
        },
        children: [
          {
            component: "HistoryToggleOff",
            component_name: "single_result_box_date_icon",
            props: {
              style: { color: "gray" },
            },
          },
          {
            component: "Typography",
            component_name: "single_result_box_date_typography",
            props: {
              component: "div",
              variant: "body2",
              color: "text.secondary",
            },
            value: row?.date,
          }
        ]
      },
      {
        component: "Box",
        component_name: "single_result_box_score",
        props: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        children: [
          {
            component: "Typography",
            component_name: "single_result_box_score_typography",
            props: {
              component: "div",
              variant: "body2",
            },
            value: __("Score: ", "acadlix") + row?.score,
          },
          {
            component: "Chip",
            component_name: "single_result_box_score_chip",
            props: {
              color: color,
              label: label,
            },
          }
        ]
      }
    ],
  }

  const singleResult = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.result.singleResult',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      isDesktop: props?.isDesktop,
      row: row,
    }
  )?.filter(Boolean) || [];

  return (
    <>
      {singleResult.map((field, i) => (
        <DynamicMUIRenderer
          item={field}
          key={i}
          formProps={{
            register: props?.register,
            watch: props?.watch,
            setValue: props?.setValue,
          }}
        />
      ))}
    </>
  )
}
