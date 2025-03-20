import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { DeleteOrderById, GetOrders } from "../../../requests/admin/AdminOrderRequest";
import { currencyPosition } from "../../../helpers/util";
import { dateI18n } from "@wordpress/date";
import { FaEdit, FaSearch, FaTrash, IoClose, IoMdRefresh } from "../../../helpers/icons";
import { __ } from "@wordpress/i18n";
import { Link } from "react-router-dom";
import CustomTextField from "../../../components/CustomTextField";

const Order = () => {
  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      order_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const deleteMutation = DeleteOrderById();
  const deleteOrderById = (id) => {
    if (confirm(__("If you delete this order, all associated data will also be removed, including order items, metadata, and the user's course progress.", "acadlix"))) {
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
    { field: "transaction_id", headerName: __("Txn ID", "acadlix"), flex: 1, minWidth: 120 },
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
          </>
        )
      }
    }
  ];

  const { isFetching, data, refetch } = GetOrders(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search")
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
          total_amount: currencyPosition(order?.total_amount),
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

  return (
    <Box>
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  >
                    {__("Orders", "acadlix")}
                  </Typography>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to="/create"
                    color="primary"
                  >
                    {__("Add", "acadlix")}
                  </Button>
                  <Tooltip title={__("Refresh", "acadlix")} arrow>
                    <Button variant="contained" onClick={refetch} size="large">
                      <IoMdRefresh />
                    </Button>
                  </Tooltip>
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
                  gap: 2,
                  alignItems: "baseline",
                  justifyContent: "flex-end",
                }}
              >
                {/* <Box
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
                      Bulk Actions
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={methods?.watch("action")}
                      label="Bulk Actions"
                      onChange={handleActionChange}
                    >
                      <MenuItem value="">Bulk Actions</MenuItem>
                      <MenuItem value="delete">Delete</MenuItem>
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
                    color="primary"
                  >
                    Apply
                  </Button>
                </Box> */}
                <Box>
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
                  onPaginationModelChange={setPaginationModel}
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
