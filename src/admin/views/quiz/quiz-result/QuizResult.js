import React from "react";
import {
  Typography,
  Paper,
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
  InputAdornment,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import {
  FaTrash,
  TiArrowLeftThick,
  IoMdRefresh,
  FaSearch
} from "@acadlix/helpers/icons";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  DeleteStatisticById,
  GetStatisticByQuizId,
  PostResetStatisticByQuizId,
} from "@acadlix/requests/admin/AdminStatisticRequest";
import dateFormat from "dateformat";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import CustomTextField from "@acadlix/components/CustomTextField";
import toast from "react-hot-toast";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const ViewAnswerSheetButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_view_answer_sheet_button" */
        "@acadlix/pro/admin/quiz/quiz-result/ViewAnswerSheetButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_view_answer_sheet_button" */
        "@acadlix/free/admin/quiz/quiz-result/ViewAnswerSheetButton"
      )
)

const QuizResult = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quiz_id } = useParams();

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminQuizResultPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminQuizResultPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
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
          toast.success(__('Result successfully reset.', 'acadlix'));
        }
      });
    }
  };

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

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
          <>
            {
              params?.value === "Pass" &&
              <Chip
                color="success"
                label={params?.value}
              />
            }
            {
              params?.value === "Fail" &&
              <Chip
                color="error"
                label={params?.value}
              />
            }
            {
              params?.value === "NA" &&
              <Chip
                color="grey"
                label={params?.value}
              />
            }
          </>
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
            <React.Suspense fallback={null}>
              <ViewAnswerSheetButton
                quiz_id={quiz_id}
                id={params?.id}
              />
            </React.Suspense>
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
    paginationModel?.pageSize,
    methods?.watch("search"),
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.stat_refs)) {
      const newRows = data?.data?.stat_refs?.map((stat_ref) => {
        return {
          id: stat_ref?.id,
          name: stat_ref?.user ? `${stat_ref?.user?.display_name} (${stat_ref?.user?.user_login})` : __("Anonymous", "acadlix"),
          date: dateFormat(stat_ref?.created_at, "mmm dd, yyyy hh:MM:ss TT"),
          score: stat_ref?.points?.toFixed(2),
          percentage: stat_ref?.result?.toFixed(2),
          status: stat_ref?.status ?? "NA",
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

  const handleSearch = (e) => {
    methods?.setValue("search", e?.target?.value, { shouldDirty: true });
  }

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminQuizResultPage', model.page);
    localStorage.setItem('adminQuizResultPageSize', model.pageSize);
  };

  return (
    <Box>
      <Grid
        container
        spacing={{ xs: 2, sm: 4 }}
        sx={{
          padding: {
            xs: 2,
            sm: 4,
          },
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
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                  >
                    {/* translators: %s is the quiz title */}
                    {sprintf(
                      __("Statistics (%s)", "acadlix"),
                      methods?.watch("title")
                    )}
                  </Typography>
                  <CustomRefresh
                    refetch={refetch}
                  />
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
                        bgcolor: "primary.main",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: 'primary.contrastText'
                         }}
                      >
                        {`${isMobile ? __("Qs:", "acadlix") : __("Questions:", "acadlix")} ${methods?.watch("question_count")}`}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "success.main",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: 'success.contrastText'
                         }}
                      >
                        {__("Pass:", "acadlix")} {methods?.watch("pass_count")}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "error.main",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: 'error.contrastText'
                         }}
                      >
                        {__("Fail:", "acadlix")} {methods?.watch("fail_count")}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "warning.main",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: 'warning.contrastText'
                         }}
                      >
                        {__("Total Attempt:", "acadlix")} {methods?.watch("attempt_counts")}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}>
                      <CustomTextField
                        size="small"
                        label={__("Search", "acadlix")}
                        helperText={__("Search by username", "acadlix")}
                        name="search"
                        value={methods?.watch("search") ?? ""}
                        onChange={handleSearch}
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
                  onPaginationModelChange={handlePaginationChange}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  disableColumnMenu
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
