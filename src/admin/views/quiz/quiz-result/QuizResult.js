import React from "react";
import {
  Grid,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaCheckCircle, FaExpandArrowsAlt, FaTimesCircle, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  DeleteStatisticById,
  GetStatisticByQuizId,
} from "../../../../requests/admin/AdminStatisticRequest";
import dateFormat from "dateformat";
import { TiArrowLeftThick } from "react-icons/ti";

const QuizResult = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const methods = useForm({
    defaultValues: {
      rows: [],
      statistic_ref_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const deleteMutation = DeleteStatisticById();
  const deleteStatisticById = (id) => {
    if (confirm("Do you really want to delete this result?")) {
      deleteMutation?.mutate(id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name / Username", flex: 2, minWidth: 250 },
    { field: "date", headerName: "Date/Time", flex: 1, minWidth: 250 },
    { field: "score", headerName: "Score", flex: 1, minWidth: 100 },
    { field: "percentage", headerName: "Percentage", flex: 1, minWidth: 100 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.percentage >= params?.row?.minimum_percent_to_pass
              ? <FaCheckCircle style={{ color: theme?.palette?.success?.main }} />
              : <FaTimesCircle style={{ color: theme?.palette?.error?.main }} />
              }
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Answersheet">
            <IconButton
              aria-label="expand"
              size="small"
              color="warning"
              LinkComponent={Link}
              to={`/quiz/${quiz_id}/result/${params?.id}`}
            >
              <FaExpandArrowsAlt fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
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
        </Box>
      ),
    },
  ];

  const { data, isFetching } = GetStatisticByQuizId(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return {
          id: stat_ref?.id,
          name: `${stat_ref?.user?.display_name} (${stat_ref?.user?.user_login})` ,
          date: dateFormat(
            stat_ref?.created_at,
            "mmm dd, yyyy hh:MM:ss TT"
          ),
          score: stat_ref?.points?.toFixed(2),
          percentage: stat_ref?.result?.toFixed(2),
          minimum_percent_to_pass: data?.data?.quiz?.minimum_percent_to_pass,
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
        <Grid item xs={12} lg={12}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to={`/quiz`}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Card>
            <CardHeader title="SSC CHSL" />
            <CardContent>
              {/* Details Section */}
              <Box
                width={isMobile ? "90%" : "85%"}
                sx={{ marginBottom: "20px" }}
              >
                <Grid container spacing={isMobile ? 2 : 3}>
                  <Grid item xs={12} sm={6} md={3}>
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
                        {isMobile ? "Qs: 10" : "Questions: 10"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                        {isMobile ? "Marks: 100" : "Maximum Marks: 100"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                        Time: 30 mins
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                        Passing %: 50%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ width: "100%" }}>
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
  );
};

export default QuizResult;
