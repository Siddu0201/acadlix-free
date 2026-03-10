import CustomRefresh from '@acadlix/components/CustomRefresh';
import CustomTextField from '@acadlix/components/CustomTextField';
import { FaEdit, FaSearch, FaTrash } from '@acadlix/helpers/icons';
import { hasCapability } from '@acadlix/helpers/util';
import { DeleteBulkCoupon, DeleteCouponById, GetCoupons } from '@acadlix/requests/admin/AdminCouponRequest';
import { Box, Button, Card, CardContent, CardHeader, Chip, FormControl, Grid, IconButton, InputAdornment, MenuItem, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';
import { dateI18n } from "@wordpress/date";

const Coupon = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminCouponPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminCouponPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      coupon_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteCouponById();
  const deleteCouponById = (id) => {
    if (confirm(__('Are you sure you want to delete this coupon?', 'acadlix'))) {
      deleteMutation.mutate(id);
    }
  }

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "code", headerName: __("Code", "acadlix"), flex: 1, minWidth: 130 },
    {
      field: "discount_type", headerName: __("Discount Type", "acadlix"), flex: 1, minWidth: 90,
      renderCell: (params) => {
        return (
          <Chip
            label={params?.value === "flat" ? __("Flat", "acadlix") : __("Percentage", "acadlix")}
            color={params?.value === "flat" ? "primary" : "success"}
          />
        );
      }

    },
    { field: "discount", headerName: __("Discount", "acadlix"), flex: 1, minWidth: 70 },
    { field: "expiry_date", headerName: __("Expiry Date", "acadlix"), flex: 2, minWidth: 150 },
    {
      field: "usage_count", headerName: __("Usage Count", "acadlix"), flex: 1, minWidth: 100,
      renderCell: (params) => {
        return (
          <>{params?.row?.coupon_usage || 0} / {params?.row?.usage_limit_per_coupon > 0 ? params?.row?.usage_limit_per_coupon : '∞'}</>
        );
      }
     },
{
  field: "status", headerName: __("Status", "acadlix"), flex: 1, minWidth: 80,
    renderCell: (params) => {
      return (
        <Chip
          label={params?.value ? __("Inactive", "acadlix") : __("Active", "acadlix")}
          color={params?.value ? "error" : "success"}
        />
      );
    }
},
{
  field: "actions", headerName: __("Actions", "acadlix"),
    flex: 1,
      minWidth: 150,
        sortable: false,
          renderCell: (params) => {
            return (
              <>
                {
                  hasCapability("acadlix_edit_coupon") &&
                  <Tooltip title={__("Edit Coupon", "acadlix")} arrow>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      color="primary"
                      LinkComponent={Link}
                      to={`/edit/${params?.id}`}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                }
                {
                  hasCapability("acadlix_delete_coupon") &&
                  <Tooltip title={__("Delete Coupon", "acadlix")} arrow>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      color="error"
                      onClick={deleteCouponById.bind(this, params?.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                }
              </>
            );
          }
},
  ];

const { isFetching, data, refetch } = GetCoupons(
  paginationModel.page,
  paginationModel.pageSize,
  methods.watch("search")
);

React.useMemo(() => {
  if (Array.isArray(data?.data?.coupons)) {
    const newRows = data.data.coupons.map(coupon => ({
      id: coupon.ID,
      code: coupon?.post_title,
      discount_type: coupon?.rendered_metas?.discount_type,
      discount: coupon?.rendered_metas?.discount,
      expiry_date: coupon?.rendered_metas?.expiry_date ? dateI18n(acadlixOptions?.date_time_format, coupon?.rendered_metas?.expiry_date) : "-",
      status: coupon?.rendered_metas?.disable_coupon,
      coupon_usage: coupon?.coupon_usage,
      usage_limit_per_coupon: coupon?.rendered_metas?.usage_limit_per_coupon,
    }));
    methods.setValue("rows", newRows);
  }
}, [data]);

const rowCountRef = React.useRef(data?.data?.total || 0);

const rowCount = React.useMemo(() => {
  if (data?.data?.total !== undefined) {
    rowCountRef.current = data?.data?.total;
  }
  return rowCountRef.current;
}, [data?.data?.total]);

const deleteBulkMutation = DeleteBulkCoupon();
const handleBulkDelete = () => {
  if (
    confirm(
      __("Deleting these coupon(s) will permanently remove all associated data. Are you sure you want to proceed?", "acadlix")
    )
  ) {
    deleteBulkMutation?.mutate(
      {
        coupon_ids: methods?.watch("coupon_ids"),
      },
      {
        onSettled: () => {
          methods?.setValue("action", "", { shouldDirty: true });
          methods?.setValue("coupon_ids", [], { shouldDirty: true });
        },
      }
    );
  }
};

const handleActionChange = (e) => {
  methods?.setValue("action", e?.target?.value, { shouldDirty: true });
};

const handleBulkAction = () => {
  if (methods?.watch("action")) {
    methods?.clearErrors("action");
    if (methods?.watch("coupon_ids")?.length > 0) {
      switch (methods?.watch("action")) {
        case "delete":
          handleBulkDelete();
          break;
        default:
      }
    } else {
      toast.error(__("Please select atleast 1 entry.", "acadlix"), {
        position: "bottom-left",
      });
    }
  } else {
    methods?.setError("action", {
      type: "custom",
      message: __("Action required", "acadlix"),
    });
  }
};

const handleSearch = (e) => {
  methods?.setValue("search", e?.target?.value, { shouldDirty: true });
}

const handlePaginationChange = (model) => {
  setPaginationModel(model);
  localStorage.setItem('adminCouponPage', model.page);
  localStorage.setItem('adminCouponPageSize', model.pageSize);
};

return (
  <Box>
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 4,
      }}
      sx={{
        padding: {
          xs: 2,
          sm: 4,
        }
      }}
    >
      <Grid size={{ xs: 12, lg: 12 }}>
        <Card>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h3"
                >
                  {__("Coupon Overview", "acadlix")}
                </Typography>
                {
                  hasCapability("acadlix_add_coupon") &&
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to="/create"
                    color="primary"
                  >
                    {__("Add", "acadlix")}
                  </Button>
                }
                <CustomRefresh
                  refetch={refetch}
                />
              </Box>
            }
            sx={{
              paddingX: 4,
              paddingY: 2,
              paddingBottom: 1,
            }}
          ></CardHeader>
          <CardContent>
            <Box
              sx={{
                paddingBottom: 2,
                display: {
                  xs: "block",
                  sm: "flex",
                },
                gap: 2,
                alignItems: "flex-start",
                justifyContent: hasCapability("acadlix_bulk_action_coupon")
                  ? "space-between"
                  : "flex-end"
              }}
            >
              {
                hasCapability("acadlix_bulk_action_coupon") &&
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "baseline",
                  }}
                >
                  <FormControl
                    sx={{ minWidth: 150 }}
                    size="small"
                    error={Boolean(methods?.formState?.errors?.action)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {__("Bulk Actions", "acadlix")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={methods?.watch("action")}
                      label={__("Bulk Actions", "acadlix")}
                      onChange={handleActionChange}
                    >
                      <MenuItem value="">{__("Bulk Actions", "acadlix")}</MenuItem>
                      {
                        hasCapability("acadlix_bulk_delete_coupon") &&
                        <MenuItem value="delete">{__("Delete", "acadlix")}</MenuItem>
                      }
                    </Select>
                    <FormHelperText>
                      {methods?.formState?.errors?.action?.message}
                    </FormHelperText>
                  </FormControl>
                  <Button
                    variant="contained"
                    sx={{
                      marginRight: 2,
                    }}
                    onClick={handleBulkAction}
                    color="primary"
                  >
                    {__("Apply", "acadlix")}
                  </Button>
                </Box>
              }
              <Box>
                <CustomTextField
                  label={__("Search", "acadlix")}
                  helperText={__("Search by coupon code", "acadlix")}
                  fullWidth
                  size="small"
                  type="search"
                  value={methods?.watch("search")}
                  onChange={handleSearch}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <FaSearch />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <DataGrid
                rows={methods?.watch("rows")}
                columns={columns}
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                paginationMode="server"
                pageSizeOptions={[10, 20, 50, 100]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                onRowSelectionModelChange={(data) => {
                  methods?.setValue("coupon_ids", data, {
                    shouldDirty: true,
                  });
                }}
                rowSelectionModel={methods?.watch("coupon_ids")}
                autoHeight
                loading={isFetching || deleteMutation?.isPending}
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
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
)
}

export default Coupon