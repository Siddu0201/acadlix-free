import React from "react";
import {
  Typography,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Chip,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DataGrid } from "@mui/x-data-grid";
import {
  FaExpandArrowsAlt,
  FaTrash,
  TiArrowLeftThick,
  IoMdRefresh
} from "../../../../helpers/icons";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  DeleteStatisticById,
  GetStatisticByQuizId,
  PostResetStatisticByQuizId,
} from "../../../../requests/admin/AdminStatisticRequest";
import dateFormat from "dateformat";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "../../../../helpers/util";

const QuizResult = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const methods = useForm({
    defaultValues: {
      title: "",
      rows: [],
      question_count: 0,
      pass_count: 0,
      fail_count: 0,
      attempt_counts: 0,
      statistic_ref_ids: [],
      action: "",
    },
  });

  const resetStatistic = PostResetStatisticByQuizId(quiz_id);
  const handleResetStatistic = () => {
    if (confirm(__("Do you really want to reset this statistic?", "acadlix"))) {
      resetStatistic?.mutate({}, {
        onSuccess: (data) => {
          console.log(data);
        }
      });
    }
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const deleteMutation = DeleteStatisticById();
  const deleteStatisticById = (id) => {
    if (confirm(__("Do you really want to delete this result?", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  };

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "name", headerName: __("Name / Username", "acadlix"), flex: 2, minWidth: 250 },
    { field: "date", headerName: __("Date/Time", "acadlix"), flex: 1, minWidth: 250 },
    { field: "score", headerName: __("Score", "acadlix"), flex: 1, minWidth: 100 },
    { field: "percentage", headerName: __("Percentage", "acadlix"), flex: 1, minWidth: 100 },
    {
      field: "status",
      headerName: __("Status", "acadlix"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Chip
            color={params?.value === "Pass" ? "success" : "error"}
            label={params?.value}
          />
        );
      },
    },
    {
      field: "action",
      headerName: __("Action", "acadlix"),
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box>
          {
            hasCapability("acadlix_show_answersheet") &&
            <Tooltip title={__("View Answersheet", "acadlix")}>
              <IconButton
                aria-label="expand"
                size="small"
                color="warning"
                LinkComponent={Link}
                to={`/${quiz_id}/result/${params?.id}`}
              >
                <FaExpandArrowsAlt fontSize="inherit" />
              </IconButton>
            </Tooltip>
          }
          {
            hasCapability("acadlix_delete_statistic") &&
            <Tooltip title={__("Delete", "acadlix")}>
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                sx={{ ml: 1 }}
                onClick={deleteStatisticById.bind(this, params?.id)}
              >
                <FaTrash fontSize="inherit" />
              </IconButton>
            </Tooltip>
          }
        </Box>
      ),
    },
  ];

  const { data, isFetching, refetch } = GetStatisticByQuizId(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return {
          id: stat_ref?.id,
          name: `${stat_ref?.user?.display_name} (${stat_ref?.user?.user_login})`,
          date: dateFormat(stat_ref?.created_at, "mmm dd, yyyy hh:MM:ss TT"),
          score: stat_ref?.points?.toFixed(2),
          percentage: stat_ref?.result?.toFixed(2),
          status: stat_ref?.status,
        };
      });
      methods.setValue("rows", newRows, { shouldDirty: true });
    }
    if (data?.data?.quiz) {
      methods.setValue("question_count", data?.data?.quiz?.questions_count, { shouldDirty: true });
      methods.setValue("title", data?.data?.quiz?.post_title, { shouldDirty: true });
    }
    methods?.setValue("pass_count", data?.data?.pass_count, { shouldDirty: true });
    methods?.setValue("fail_count", data?.data?.fail_count, { shouldDirty: true });
    methods?.setValue("attempt_counts", data?.data?.total, { shouldDirty: true });
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  return (
    <Box>
      <Grid
        container
        rowSpacing={4}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to={`/`}
          >
            {__('Back', 'acadlix')}
          </Button>
          {
            hasCapability("acadlix_reset_statistic") &&
            <Button
              variant="contained"
              size="medium"
              sx={{
                width: "fit-content",
                marginLeft: "1rem",
              }}
              onClick={handleResetStatistic}
            >
              {__('Reset Statistics', 'acadlix')}
            </Button>
          }
        </Grid>
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
                    {methods?.watch("title")}
                  </Typography>
                  <Tooltip title={__("Refresh", "acadlix")} arrow>
                    <Button variant="contained" onClick={refetch} size="large">
                      <IoMdRefresh />
                    </Button>
                  </Tooltip>
                </Box>
              }
            />
            <CardContent>
              {/* Details Section */}
              <Box
                width={isMobile ? "90%" : "100%"}
                sx={{ marginBottom: "20px" }}
              >
                <Grid container spacing={isMobile ? 2 : 3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#1976d2",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {`${isMobile ? __("Qs:", "acadlix") : __("Questions:", "acadlix")} ${methods?.watch("question_count")}`}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#4caf50",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {__("Pass:", "acadlix")} {methods?.watch("pass_count")}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#f44336",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {__("Fail:", "acadlix")} {methods?.watch("fail_count")}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "#ff9800",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {__("Total Attempt:", "acadlix")} {methods?.watch("attempt_counts")}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{
                width: "100%",
                display: 'flex',
                flexDirection: 'column',
              }}>
                <DataGrid
                  rows={methods.watch("rows")}
                  columns={columns}
                  rowCount={rowCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("statistic_ref_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("statistic_ref_ids")}
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
  );
};

export default QuizResult;
