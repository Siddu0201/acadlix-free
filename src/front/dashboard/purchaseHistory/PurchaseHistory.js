import * as React from "react";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { IoMdRefresh, FaMoneyBillTransfer, HistoryToggleOff } from "../../../helpers/icons";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DataGrid } from "@mui/x-data-grid";
import { GetUserPurchases } from "@acadlix/requests/front/FrontDashboardRequest";
import { dateI18n } from "@wordpress/date";
import { currencyPosition } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const PurchaseHistory = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('frontPurchaseHistoryPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('frontPurchaseHistoryPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      order_ids: [],
    },
  });

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
    { field: "order_id", headerName: __("Order/Txn ID", "acadlix"), flex: 2, minWidth: 180 },
    { field: "order_date", headerName: __("Order Date", "acadlix"), minWidth: 180 },
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
          <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}>
            <Chip
              label={value.charAt(0).toUpperCase() + value.slice(1)}
              color={color}
              variant="filled"
            />
          </div>
        );
      },
    },
    {
      field: "total_amount",
      headerName: __("Amount", "acadlix"),
      flex: 1,
      minWidth: 100,
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const { isFetching, data, refetch } = GetUserPurchases(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
  };

  const getOrderId = (order_metas = []) => {
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
            "Free"
          )?.toUpperCase(),
          order_id: getOrderId(order?.order_metas),
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

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('frontPurchaseHistoryPage', model.page);
    localStorage.setItem('frontPurchaseHistoryPageSize', model.pageSize);
  };

  return isMobile ? (
    <MobileOnlyView
      {...methods}
      isFetching={isFetching}
      paginationModel={paginationModel}
      handlePaginationChange={handlePaginationChange}
    />
  ) : (
    <Box>
      <Grid container rowSpacing={3} spacing={4}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card
            sx={{
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
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
                    {__("Purchase History", "acadlix")}
                  </Typography>
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
            />
            <CardContent>
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
                    methods?.setValue("purchase_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("purchase_ids")}
                  loading={isFetching}
                  columnVisibilityModel={{
                    id: false,
                  }}
                  autoHeight
                  // getRowHeight={() => "auto"}
                  // getEstimatedRowHeight={() => 200}
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
  );
};

export default PurchaseHistory;

const MobileOnlyView = (props) => {
  return (
    <Box>
      {props?.isFetching ? (
        <Box display="flex" justifyContent="center" padding={2}>
          <CircularProgress />
        </Box>
      ) : (
        props?.watch("rows")?.map((row, index) => (
          <Box
            key={index}
            sx={{
              padding: "8px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
              marginBottom: "8px",
              borderRadius: "8px",
              backgroundColor: "white",
              marginX: "8px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ fontSize: "14px", flex: 1 }}
              >
                {row.order_items}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ marginY: "4px" }}>
              <HistoryToggleOff
                sx={{ marginRight: "4px", color: "gray", fontSize: "18px" }}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontSize: "12px" }}
              >
                {row?.order_date}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" sx={{ fontSize: "12px" }}>
                {row?.total_amount}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", display: "flex", alignItems: "center" }}
              >
                <FaMoneyBillTransfer style={{ marginRight: "4px" }} />
                {row?.payment_method}
              </Typography>
            </Box>
          </Box>
        ))
      )}
      <Box display="flex" justifyContent="center" padding={2}>
        <TablePagination
          component="div"
          count={props?.watch("rows").length}
          page={props?.paginationModel?.page}
          onPageChange={(_, newPage) => props?.handlePaginationChange({ ...props?.paginationModel, page: newPage })}
          rowsPerPage={props?.paginationModel?.pageSize}
          onRowsPerPageChange={(e) => {
            const pageSize = parseInt(e?.target?.value);
            const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
            props?.handlePaginationChange({
              pageSize: pageSize,
              page: page,
            })
          }}
        />
        {/* <Stack spacing={2}>
          <Pagination
            count={Math.ceil(
              props?.watch("rows").length / props?.paginationModel?.pageSize
            )}
            page={props?.paginationModel?.page}
            onChange={(e, value) =>
              props?.handlePaginationChange({ ...props?.paginationModel, page: value })
            }
          />
        </Stack> */}
      </Box>
    </Box>
  );
};
