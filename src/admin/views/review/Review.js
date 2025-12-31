import { FaSearch, FaTrash } from '@acadlix/helpers/icons';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, NativeSelect, Select, Tooltip } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { DeleteReviewById, GetReviews, UpdateReviewById } from '@acadlix/requests/admin/AdminReviewRequest';
import CustomRating from '@acadlix/components/CustomRating';
import { getFormatDate, hasCapability } from '@acadlix/helpers/util';
import { gridClasses } from '@mui/x-data-grid';

const Review = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminReviewPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminReviewPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      review_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteReviewById();
  const deleteReviewById = (id) => {
    if (confirm(__('Are you sure you want to delete this review?', 'acadlix'))) {
      deleteMutation.mutate(id);
    }
  };

  let columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'student',
      headerName: 'Student',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 160,
      flex: 1,
      renderCell: (params) => getFormatDate(params.value),
    },
    {
      field: 'course',
      headerName: 'Course',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      minWidth: 300,
      flex: 2,
      renderCell: (params) => {
        return (
          <>
            <CustomRating value={params.row?.rating} fontSize={16} style={{ marginRight: 8 }} />
            <Box>
              {params.value}
            </Box>
          </>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const [status, setStatus] = React.useState(params.value);
        const updateMutation = UpdateReviewById(params.id);

        const handleChange = (e) => {
          if(status === e.target.value) return;
          setStatus(e.target.value);
          updateMutation.mutate({
            comment_approved: e.target.value,
          });
        };

        return (
          <FormControl
            fullWidth
            size="small"
          >
            <Select
              value={status}
              onChange={handleChange}
              sx={{
                borderRadius: "15px",
                backgroundColor: (theme) => status === "approved" ? theme.palette?.success?.main : theme?.palette?.warning?.main,
                color: (theme) => theme?.palette?.success?.contrastText,
                '& .MuiInputBase-input': {
                  padding: "2px 10px",
                }
              }}
            >
              <MenuItem value="pending">{__('Pending', 'acadlix')}</MenuItem>
              <MenuItem value="approved">{__('Approved', 'acadlix')}</MenuItem>
            </Select>
          </FormControl >
        )
      }
    },

    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {
              hasCapability('acadlix_delete_review') &&
              <Tooltip title={__('Delete Review', 'acadlix')}>
                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={deleteReviewById.bind(this, params?.id)}
                >
                  <FaTrash />
                </IconButton>
              </Tooltip>
            }
          </>
        )
      }
    }
  ];

  let filteredColumns = window.acadlixHooks?.applyFilters(
    'acadlix.admin.review.columns',
    columns
  ) || columns;

  const { isFetching, refetch, data } = GetReviews(
    paginationModel.page,
    paginationModel.pageSize,
    methods?.watch("search")
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.reviews)) {
      const newRows = data?.data?.reviews.map((review) => {
        return {
          id: review?.comment_ID,
          rating: Number(review?.rating) || 0,
          comment: review?.comment_content || '',
          student: review?.comment_author || '',
          course: review?.course?.post_title || '',
          date: review?.comment_date || '',
          status: review?.comment_approved || '',
        }
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
    localStorage.setItem('adminReviewPage', model.page);
    localStorage.setItem('adminReviewPageSize', model.pageSize);
  };

  const defaultSetting = {
    component: "Box",
    component_name: "admin_review_box",
    children: [
      {
        component: "Grid",
        component_name: "admin_review_grid",
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
            component_name: "admin_review_grid_item",
            props: {
              size: {
                xs: 12,
                lg: 12,
              },
            },
            children: [
              {
                component: "Card",
                component_name: "admin_review_card",
                children: [
                  {
                    component: "CardHeader",
                    component_name: "admin_review_card_header",
                    props: {
                      title: {
                        component: "Box",
                        component_name: "admin_review_card_header_box",
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
                            component_name: "admin_review_card_header_typography",
                            props: {
                              variant: "h3",
                            },
                            value: __("Review Overview", "acadlix"),
                          },
                          {
                            component: "CustomRefresh",
                            component_name: "admin_review_card_header_custom_refresh",
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
                    component_name: "admin_review_card_content",
                    children: [
                      {
                        component: "Box",
                        component_name: "admin_review_card_content_box",
                        props: {
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        },
                        children: [
                          {
                            component: "Box",
                            component_name: "admin_review_card_content_search_box",
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
                                component_name: "admin_review_card_content_search_box_custom_text_field",
                                props: {
                                  ...methods?.register("search"),
                                  label: __("Search", "acadlix"),
                                  helperText: __("Search by student, course, status", "acadlix"),
                                  fullWidth: true,
                                  size: "small",
                                  type: "search",
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
                        component_name: "admin_review_card_content_data_grid_box",
                        props: {
                          sx: {
                            height: "100%",
                          }
                        },
                        children: [
                          {
                            component: "DataGrid",
                            component_name: "admin_review_card_content_data_grid",
                            props: {
                              rows: methods?.watch("rows") || [],
                              columns: filteredColumns,
                              rowCount: rowCount,
                              paginationModel: paginationModel,
                              onPaginationModelChange: handlePaginationChange,
                              paginationMode: "server",
                              pageSizeOptions: [10, 20, 50, 100],
                              checkboxSelection: false,
                              disableRowSelectionOnClick: true,
                              disableColumnMenu: true,
                              onRowSelectionModelChange: (model) => {
                                methods.setValue("review_ids", model, { shouldDirty: true });
                              },
                              rowSelectionModel: methods?.watch("review_ids"),
                              loading: isFetching,
                              columnVisibilityModel: {
                                id: false,
                              },
                              getRowHeight: () => 'auto',
                              sx: {
                                '& .PrivateSwitchBase-input': {
                                  height: '100% !important',
                                  width: '100% !important',
                                  margin: "0 !important"
                                },
                                [`& .${gridClasses.cell}`]: {
                                  py: 0.75,
                                },
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
  };

  const review_settings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.review.review",
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
      {review_settings.map((field, i) => (
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

export default Review