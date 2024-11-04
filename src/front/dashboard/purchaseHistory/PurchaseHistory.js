import * as React from "react";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BiExpand, BiReceipt } from "react-icons/bi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetUserPurchases } from "../../../requests/front/FrontDashboardRequest";
import { dateI18n } from "@wordpress/date";
import { currencyPosition } from "../../../helpers/util";

const PurchaseHistory = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      order_ids: [],
    },
  });

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "order_items",
      headerName: "Order Items",
      flex: 3,
      minWidth: 180,
    },
    {
      field: "payment_method",
      headerName: "Method",
      flex: 1,
      minWidth: 100,
    },
    { field: "order_id", headerName: "Order/Txn ID", flex: 2, minWidth: 180 },
    { field: "order_date", headerName: "Order Date", minWidth: 180 },
    {
      field: "status",
      headerName: "Status",
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
      headerName: "Amount",
      flex: 1,
      minWidth: 100,
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const { isFetching, data } = GetUserPurchases(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const getOrderMetaValue = (order_metas = [], meta_key = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? "";
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
        return "";
    }
  };

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.orders)) {
      const newRows = data?.data?.orders?.map((order) => {
        const currentDate = new Date(order?.created_at);
        const formattedDate = dateI18n(
          acadlixOptions?.date_format,
          currentDate
        );
        const formattedTime = dateI18n(
          acadlixOptions?.time_format,
          currentDate
        );
        return {
          id: order?.id,
          status: order?.status,
          payment_method: getOrderMetaValue(
            order?.order_metas,
            "payment_method"
          )?.toUpperCase(),
          order_id: getOrderId(order?.order_metas),
          order_date: `${formattedDate} ${formattedTime}`,
          user_name: `${order?.user?.display_name} (${order?.user?.user_login})`,
          user_email: order?.user?.user_email,
          total_amount: currencyPosition(order?.total_amount),
          order_items: order?.order_items
            ?.map((items) => items?.course?.post?.post_title)
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

  return isMobile ? (
    <MobileOnlyView
      {...methods}
      isFetching={isFetching}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
    />
  ) : (
    <Box>
      <Grid container rowSpacing={3} spacing={4}>
        <Grid item xs={12} lg={12}>
          <Card
            sx={{
              boxShadow: "none",
            }}
          >
            <CardHeader title="Purchase History" />
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
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection={false}
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("purchase_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("purchase_ids")}
                  autoHeight
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
  console.log(props?.watch("rows"));
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
              <HistoryToggleOffIcon
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
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(
              props?.watch("rows").length / props?.paginationModel?.pageSize
            )}
            page={props?.paginationModel?.page}
            onChange={(e, value) =>
              props?.setPaginationModel((p) => ({ ...p, page: value }))
            }
          />
        </Stack>
      </Box>
    </Box>
  );
};
