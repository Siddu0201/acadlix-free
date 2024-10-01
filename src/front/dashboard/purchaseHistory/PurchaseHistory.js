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
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const PurchaseHistory = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      purchase_ids: [],
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 2, minWidth: 130 },
    { field: "date_time", headerName: "Date & Time", flex: 1, minWidth: 90 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 3,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Result" arrow>
              <IconButton aria-label="edit" size="small" color="primary">
                <BiExpand />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return isMobile ? (
    <MobileOnlyView
      {...methods}
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
                  rowCount={methods?.watch("rows")?.length}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("purchase_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("purchase_ids")}
                  autoHeight
                  loading={false}
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
  return (
    <Box>
      {props?.watch("rows")?.map((row, index) => (
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
              {row.courseName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BiReceipt style={{ marginRight: "8px" }} />
              <Button
                variant="contained"
                sx={{
                  color: "black",
                  padding: "4px 8px",
                  fontSize: "10px",
                  minWidth: "auto",
                  marginLeft: "8px",
                }}
              >
                Receipt
              </Button>
            </Box>
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
              {row?.dateTime}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              {row?.amount}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", display: "flex", alignItems: "center" }}
            >
              <FaMoneyBillTransfer style={{ marginRight: "4px" }} />
              {row?.paymentMethod}
            </Typography>
          </Box>
        </Box>
      ))}
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
