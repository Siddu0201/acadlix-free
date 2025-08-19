import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { DeleteOrderById, GetOrders } from "@acadlix/requests/admin/AdminOrderRequest";
import { currencyPosition, getStripHtml, hasCapability } from "@acadlix/helpers/util";
import { dateI18n } from "@wordpress/date";
import { FaEdit, FaSearch, FaTrash, IoMdRefresh, MdFileCopy } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { Link } from "react-router-dom";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const Order = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminOrderPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminOrderPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      order_ids: [],
      action: "",
      status: "",
      payment_method: "",
      start_date: "",
      end_date: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteOrderById();
  const deleteOrderById = (id) => {
    if (confirm(__("If you delete this order, all associated data will also be removed, including order items, metadata, and the user's course progress.", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  }

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    {
      field: "order_items",
      headerName: __("Order Items", "acadlix"),
      flex: 2,
      minWidth: 130,
    },
    {
      field: "payment_method",
      headerName: __("Method", "acadlix"),
      flex: 1,
      minWidth: 100,
    },
    { field: "order_id", headerName: __("Order ID", "acadlix"), flex: 1, minWidth: 80 },
    {
      field: "transaction_id",
      headerName: __("Txn ID", "acadlix"),
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title={__("Copy Txn ID", "acadlix")} arrow>
              <IconButton
                onClick={() => {
                  navigator?.clipboard
                    ?.writeText(params?.value)
                    .then(function () {
                      toast.success(__("Txn ID copied to clipboard!", "acadlix"));
                    })
                    .catch(function (err) {
                      console.error(__("Failed to copy text: ", "acadlix"), err);
                    });
                }}
                size="small"
              >
                <MdFileCopy />
              </IconButton>
            </Tooltip>
            <Box>{params.value}</Box>
          </Box>
        );
      },
    },
    { field: "order_date", headerName: __("Order Date", "acadlix"), minWidth: 180 },
    { field: "user_name", headerName: __("Name", "acadlix"), flex: 2, minWidth: 130 },
    { field: "user_email", headerName: __("Email", "acadlix"), minWidth: 250 },
    {
      field: "status",
      headerName: __("Status", "acadlix"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const { value } = params;

        let color = "default";
        if (value === "success") color = "success";
        else if (value === "pending") color = "warning";
        else if (value === "failed") color = "error";
        return (
          <Chip
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            color={color}
            variant="filled"
          />
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total amount",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "actions",
      headerName: __("Actions", "acadlix"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            {
              hasCapability("acadlix_edit_order") &&
              <Tooltip title={__("Edit Order", "acadlix")} arrow>
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
              hasCapability("acadlix_delete_order") &&
              <Tooltip title={__("Delete Lesson", "acadlix")} arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={deleteOrderById.bind(this, params?.id)}
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

  const { isFetching, data, refetch } = GetOrders(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search"),
    methods?.watch("status"),
    methods?.watch("payment_method"),
    methods?.watch("start_date"),
    methods?.watch("end_date"),
  );

  const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
  };

  const getTransactionId = (order_metas = []) => {
    switch (getOrderMetaValue(order_metas, "payment_method")) {
      case "razorpay":
        return getOrderMetaValue(order_metas, "razorpay_order_id");
      case "paypal":
        return getOrderMetaValue(order_metas, "paypal_order_id");
      case "payu":
        return getOrderMetaValue(order_metas, "payu_txn_id");
      case "stripe":
        return getOrderMetaValue(order_metas, "stripe_order_id");
      default:
        return "N/A";
    }
  };

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.orders)) {
      const newRows = data?.data?.orders?.map((order) => {
        const formattedDateTime = dateI18n(
          acadlixOptions?.date_time_format,
          order?.created_at
        );
        return {
          id: order?.id,
          status: order?.status,
          payment_method: getOrderMetaValue(
            order?.order_metas,
            "payment_method",
            __("Free", "acadlix")
          )?.toUpperCase(),
          order_id: `#${order?.id}`,
          transaction_id: getTransactionId(order?.order_metas),
          order_date: formattedDateTime,
          user_name: `${order?.user?.display_name} (${order?.user?.user_login})`,
          user_email: order?.user?.user_email,
          total_amount: currencyPosition(order?.total_amount, getStripHtml(acadlixOptions?.currency_symbols[getOrderMetaValue(order?.order_metas, "currency", "USD")])),
          order_items: order?.order_items
            ?.map((items) => items?.course_title)
            ?.join(", "),
        };
      });
      methods?.setValue("rows", newRows, { shouldDirty: true });
    }
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

  const handleSearch = (e) => {
    methods?.setValue("search", e?.target?.value, { shouldDirty: true });
  }

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminOrderPage', model.page);
    localStorage.setItem('adminOrderPageSize', model.pageSize);
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
          },
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
                    {__("Orders", "acadlix")}
                  </Typography>
                  {
                    hasCapability("acadlix_add_order") &&
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
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 2,
                    alignItems: "baseline",
                  }}
                >
                  <FormControl
                    sx={{ minWidth: 150 }}
                    size="small"
                    error={Boolean(methods?.formState?.errors?.status)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {__("Status", "acadlix")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={methods?.watch("status")}
                      label={__("Status", "acadlix")}
                      onChange={(e) => methods?.setValue("status", e?.target?.value, { shouldDirty: true })}
                    >
                      <MenuItem value="">{__("All", "acadlix")}</MenuItem>
                      <MenuItem value="pending">{__("Pending", "acadlix")}</MenuItem>
                      <MenuItem value="success">{__("Success", "acadlix")}</MenuItem>
                      <MenuItem value="failed">{__("Failed", "acadlix")}</MenuItem>
                    </Select>
                    <FormHelperText>
                      {methods?.formState?.errors?.status?.message}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{ minWidth: 180 }}
                    size="small"
                    error={Boolean(methods?.formState?.errors?.payment_method)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {__("Payment Method", "acadlix")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={methods?.watch("payment_method")}
                      label={__("Payment Method", "acadlix")}
                      onChange={(e) => methods?.setValue("payment_method", e?.target?.value, { shouldDirty: true })}
                    >
                      <MenuItem value="">{__("All", "acadlix")}</MenuItem>
                      <MenuItem value="razorpay">{__("Razorpay", "acadlix")}</MenuItem>
                      <MenuItem value="paypal">{__("PayPal", "acadlix")}</MenuItem>
                      <MenuItem value="payu">{__("PayU", "acadlix")}</MenuItem>
                      <MenuItem value="stripe">{__("Stripe", "acadlix")}</MenuItem>
                      <MenuItem value="free">{__("Free", "acadlix")}</MenuItem>
                      <MenuItem value="admin">{__("Admin", "acadlix")}</MenuItem>
                    </Select>
                    <FormHelperText>
                      {methods?.formState?.errors?.payment_method?.message}
                    </FormHelperText>
                  </FormControl>
                  {/* <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      label={__("Start Date", "acadlix")}
                      timeSteps={{
                        minutes: 1,
                      }}
                      value={methods?.watch("start_date")}
                      onChange={(newValue) => methods?.setValue("start_date", newValue, { shouldDirty: true })}
                      sx={{

                        ".MuiInputBase-input": {
                          padding: "8px 14px !important",
                        },
                        ".MuiInputBase-input:focus": {
                          padding: "8px 14px !important",
                        },
                      }}
                    />
                    <DatePicker
                      format="DD/MM/YYYY"
                      label={__("End Date", "acadlix")}
                      timeSteps={{
                        minutes: 1,
                      }}
                      value={methods?.watch("end_date")}
                      onChange={(newValue) => methods?.setValue("end_date", newValue, { shouldDirty: true })}
                      sx={{

                        ".MuiInputBase-input": {
                          padding: "8px 14px !important",
                        },
                        ".MuiInputBase-input:focus": {
                          padding: "8px 14px !important",
                        },
                      }}
                    />
                  </DemoContainer> */}
                  <Button
                    variant="contained"
                    sx={{
                      marginRight: 2,
                    }}
                    color="primary"
                    onClick={() => {
                      methods?.setValue("status", "", { shouldDirty: true });
                      methods?.setValue("payment_method", "", { shouldDirty: true });
                    }}
                  >
                    {__("Reset", "acadlix")}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "baseline",
                  }}
                >
                  <CustomTextField
                    fullWidth
                    size="small"
                    label={__("Search", "acadlix")}
                    name="search"
                    value={methods?.watch("search") ?? ""}
                    onChange={handleSearch}
                    helperText={__("Search by order items,txn id, name, email", "acadlix")}
                    type="search"
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
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection={false}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("order_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("order_ids")}
                  autoHeight
                  loading={isFetching}
                  columnVisibilityModel={{
                    id: false,
                  }}
                  getEstimatedRowHeight={() => 100}
                  getRowHeight={() => "auto"}
                  sx={{
                    "& .PrivateSwitchBase-input": {
                      height: "100% !important",
                      width: "100% !important",
                      margin: "0 !important",
                    },
                    "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                      py: 1,
                    },
                    "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                      py: "15px",
                    },
                    "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell":
                    {
                      py: "22px",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Order;
