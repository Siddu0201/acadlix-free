import * as React from "react";
import { FaExpandArrowsAlt, HistoryToggleOff, IoMdRefresh } from "../../../helpers/icons";
import {
  Box,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  TextField,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  CardHeader,
  Chip,
  TablePagination,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import { __ } from "@wordpress/i18n";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import { GetStatisticByUserId } from "../../../requests/front/FrontStatisticRequest";

export default function Result() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      resstatistic_ref_idsult_ids: [],
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "title", headerName: __("Title", "acadlix"), flex: 3, minWidth: 250 },
    { field: "date", headerName: __("Date & Time", "acadlix"), flex: 1, minWidth: 250 },
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
            <Chip
              color={params?.value === "Pass" ? "success" : "error"}
              label={params?.value}
            />
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
                aria-label="expand"
                size="small"
                color="warning"
                LinkComponent={Link}
                to={`/result/${params?.id}`}
                disabled={params?.row?.hide_answer_sheet}
              >
                <FaExpandArrowsAlt fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const { data, isFetching, refetch } = GetStatisticByUserId(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize);

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return {
          id: stat_ref?.id,
          title: stat_ref?.quiz?.post_title,
          date: dateFormat(stat_ref?.created_at, "mmm dd, yyyy hh:MM:ss TT"),
          score: stat_ref?.points?.toFixed(2),
          percentage: stat_ref?.result?.toFixed(2),
          status: stat_ref?.status,
          hide_answer_sheet: stat_ref?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet ?? false
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

  return isMobile ? (
    <MobileOnlyView
      {...methods}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
    />
  ) : (
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
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                  }}
                >
                  {__("My Result", "acadlix")}
                </Typography>
                <Tooltip title={__("Refresh", "acadlix")} arrow>
                  <Button variant="contained" onClick={refetch} size="large">
                    <IoMdRefresh />
                  </Button>
                </Tooltip>
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
                <DataGrid
                  rows={methods?.watch("rows")}
                  columns={columns}
                  rowCount={rowCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const MobileOnlyView = (props) => {
  return (
    <Paper style={{ width: "100%", backgroundColor: "transparent" }}>
      <Box padding={1} sx={{ mx: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={__("Search Courses", "acadlix")}
          sx={{
            "& .MuiInputBase-root": {
              height: "32px",
              fontSize: "12px",
              width: "99%",
            },
          }}
        />
      </Box>

      {props?.watch("rows")?.map((row, index) => (
        <Box
          key={index}
          sx={{
            padding: "8px",
            marginTop: "8px",
            marginBottom: "8px",
            marginLeft: "8px",
            marginRight: "8px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              fontSize={"14px"}
            >
              {row?.title}
            </Typography>
            <Tooltip title={__("View Answersheet", "acadlix")} arrow>
              <IconButton
                aria-label="expand"
                size="small"
                color="warning"
                LinkComponent={Link}
                to={`/result/${row?.id}`}
                disabled={row?.hide_answer_sheet}
              >
                <FaExpandArrowsAlt fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" alignItems="center" gap="4px">
            <HistoryToggleOff style={{ color: "gray" }} />
            <Typography
              variant="body2"
              color="textSecondary"
              fontSize={"12px"}
            >
              {row?.date}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontSize={"10px"}>
              {__("Score: ", "acadlix")}{row?.score}
            </Typography>
            <Chip
              color={row?.status === "Pass" ? "success" : "error"}
              label={row?.status}
            />
          </Box>
        </Box>
      ))}

      <Box display="flex" justifyContent="center" padding={1}>
        <TablePagination
          component="div"
          count={props?.watch("rows").length}
          page={props?.paginationModel?.page}
          onPageChange={(_, newPage) => props?.setPaginationModel(prev => ({ ...prev, page: newPage }))}
          rowsPerPage={props?.paginationModel?.pageSize}
          onRowsPerPageChange={(e) => {
            const pageSize = parseInt(e?.target?.value);
            const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
            props?.setPaginationModel({
              pageSize: pageSize,
              page: page,
            })
          }}
        />
        {/* <Stack spacing={2}> */}
        {/* <Pagination
            shape="rounded"
            count={Math.ceil(
              props?.watch("rows").length / props?.paginationModel?.pageSize
            )}
            page={props?.paginationModel?.page}
            onChange={(e, value) =>
              props?.setPaginationModel((p) => ({ ...p, page: value }))
            }
          /> */}
        {/* </Stack> */}
      </Box>
    </Paper>
  );
};
