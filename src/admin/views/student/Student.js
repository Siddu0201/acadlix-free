import {
  Box,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { GetStudents } from '@acadlix/requests/admin/AdminStudentRequest';
import { FaSearch } from '@acadlix/helpers/icons';
import { DataGrid } from '@mui/x-data-grid';
import CustomTextField from '@acadlix/components/CustomTextField';
import CustomRefresh from '@acadlix/components/CustomRefresh';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const Student = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminStudentPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminStudentPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      student_ids: [],
      action: "",
    },
  });
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  let columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "name", headerName: __("Name", "acadlix"), flex: 2, minWidth: 130 },
    { field: "email", headerName: __("Email", "acadlix"), flex: 2, minWidth: 130 },
    { field: "registration_date", headerName: __("Registration Date", "acadlix"), flex: 2, minWidth: 130 },
    { field: "course_count", headerName: __("Course Count", "acadlix"), flex: 2, minWidth: 130 },
    // { field: "action", headerName: __("Action", "acadlix"), sortable: false, flex: 2, minWidth: 100 },
  ];

  let filteredColumn = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.student.columns",
    columns,
  ) ?? columns;

  const { isFetching, data, refetch } = GetStudents(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search")
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.students)) {
      const newRows = data?.data?.students?.map((student) => {
        return {
          id: student?.ID,
          name: student?.display_name,
          email: student?.user_email,
          registration_date: student?.user_registered,
          course_count: student?.course_count,
        };
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

  const handleSearch = (e) => {
    methods.setValue("search", e?.target?.value, { shouldDirty: true });
  };

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminStudentPage', model.page);
    localStorage.setItem('adminStudentPageSize', model.pageSize);
  };

  const defaultSetting = {
    component: "Box",
    component_name: "admin_student_box",
    children: [
      {
        component: "Grid",
        component_name: "admin_student_grid",
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
          },
        },
        children: [
          {
            component: "Grid",
            component_name: "admin_student_grid_item",
            props: {
              size: {
                xs: 12,
                lg: 12,
              },
            },
            children: [
              {
                component: "Card",
                component_name: "admin_student_card",
                children: [
                  {
                    component: "CardHeader",
                    component_name: "admin_student_card_header",
                    props: {
                      title: {
                        component: "Box",
                        component_name: "admin_student_card_header_box",
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
                            component_name: "admin_student_card_header_typography",
                            props: {
                              variant: "h3",
                            },
                            value: __("Student Overview", "acadlix"),
                          },
                          {
                            component: "CustomRefresh",
                            component_name: "admin_student_card_header_custom_refresh",
                            props: {
                              refetch: refetch,
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    component: "CardContent",
                    component_name: "admin_student_card_content",
                    children: [
                      {
                        component: "Box",
                        component_name: "admin_student_card_content_box",
                        props: {
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "admin_student_card_content_search_box",
                            props: {
                              sx: {
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                              }
                            },
                            children: [
                              {
                                component: "CustomTextField",
                                component_name: "admin_student_card_content_search_box_custom_text_field",
                                props: {
                                  label: __("Search", "acadlix"),
                                  helperText: __("Search by name, email", "acadlix"),
                                  fullWidth: true,
                                  size: "small",
                                  type: "search",
                                  value: methods?.watch("search"),
                                  onChange: handleSearch,
                                  slotProps: {
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <FaSearch />
                                        </InputAdornment>
                                      )
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        component: "Box",
                        component_name: "admin_student_card_content_data_grid_box",
                        props: {
                          sx: {
                            height: "100%",
                          }
                        },
                        children: [
                          {
                            component: "DataGrid",
                            component_name: "admin_student_card_content_data_grid",
                            props: {
                              rows: methods?.watch("rows"),
                              columns: filteredColumn,
                              rowCount: rowCount,
                              paginationModel: paginationModel,
                              onPaginationModelChange: handlePaginationChange,
                              paginationMode: "server",
                              pageSizeOptions: [10, 20, 50, 100],
                              checkboxSelection: true,
                              disableRowSelectionOnClick: true,
                              disableColumnMenu: true,
                              onRowSelectionModelChange: (model) => {
                                methods.setValue("student_ids", model, { shouldDirty: true });
                              },
                              rowSelectionModel: methods?.watch("student_ids"),
                              loading: isFetching,
                              columnVisibilityModel: {
                                id: false,
                              },
                              sx: {
                                '& .PrivateSwitchBase-input': {
                                  height: '100% !important',
                                  width: '100% !important',
                                  margin: "0 !important"
                                }
                              }
                            }
                          }
                        ]
                      }
                    ],
                  },
                ],
              },
            ],
          },
        ]
      },
    ]
  }

  const student_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.student.student",
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
      {student_setting.map((field, i) => (
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
  //                   {__("Student Overview", "acadlix")}
  //                 </Typography>
  //                 <CustomRefresh
  //                   refetch={refetch}
  //                 />
  //               </Box>
  //             }
  //           />
  //           <CardContent>
  //             <Box
  //               sx={{
  //                 display: "flex",
  //                 justifyContent: "flex-end",
  //                 gap: 2,
  //               }}
  //             >
  //               <Box>
  //                 <CustomTextField
  //                   label={__("Search", "acadlix")}
  //                   helperText={__("Search by name, email", "acadlix")}
  //                   fullWidth
  //                   size="small"
  //                   type="search"
  //                   value={methods?.watch("search")}
  //                   onChange={handleSearch}
  //                   slotProps={{
  //                     input: {
  //                       endAdornment: (
  //                         <InputAdornment position="end">
  //                           <FaSearch />
  //                         </InputAdornment>
  //                       )
  //                     }
  //                   }}
  //                 />
  //               </Box>
  //             </Box>
  //             <Box
  //               sx={{
  //                 height: "100%",
  //               }}
  //             >
  //               <DataGrid
  //                 rows={methods?.watch("rows")}
  //                 columns={filteredColumn}
  //                 rowCount={rowCount}
  //                 paginationModel={paginationModel}
  //                 onPaginationModelChange={handlePaginationChange}
  //                 paginationMode="server"
  //                 pageSizeOptions={[10, 20, 50, 100]}
  //                 checkboxSelection
  //                 disableRowSelectionOnClick
  //                 disableColumnMenu
  //                 onRowSelectionModelChange={(data) => {
  //                   methods?.setValue("student_ids", data, {
  //                     shouldDirty: true,
  //                   });
  //                 }}
  //                 rowSelectionModel={methods?.watch("student_ids")}
  //                 loading={isFetching}
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
  // )
}

export default Student