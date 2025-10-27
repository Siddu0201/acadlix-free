import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Link } from "react-router-dom";
import {
  DeleteBulkQuiz,
  DeleteQuizById,
  GetQuizes,
} from "@acadlix/requests/admin/AdminQuizRequest";
import {
  FaEdit,
  FaQuestion,
  FaTrash,
  FaRankingStar,
  MdFileCopy,
  IoMdRefresh,
  LuFileChartColumn,
  FaSearch
} from "@acadlix/helpers/icons";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CategoryModel from "./actions/CategoryModel";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const PragraphOptionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_pragraph_option_button" */
      "@acadlix/pro/admin/quiz/PragraphOptionButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_pragraph_option_button" */
      "@acadlix/free/admin/quiz/PragraphOptionButton"
    )
);
const SubjectOptionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_quiz_pro_subject_option_button" */
      "@acadlix/pro/admin/quiz/SubjectOptionButton"
    ) :
    import(
      /* webpackChunkName: "admin_quiz_free_subject_option_button" */
      "@acadlix/free/admin/quiz/SubjectOptionButton"
    )
);

const SubjectTimeModel = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_quiz_pro_subject_time_model" */
      "@acadlix/pro/admin/quiz/actions/SubjectTimeModel"
    ) :
    Promise.resolve({ default: () => null })
);

const Quiz = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminQuizPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminQuizPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };
  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      quiz_ids: [],
      action: "",
      category_model: false,
      subject_model: false,
      quiz_id: null,
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteQuizById();
  const deleteQuizById = (id) => {
    if (confirm(__("Do you really want to delete this quiz?", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  };

  const handleSubjectTimeClose = () => {
    methods?.setValue("quiz_id", null, { shouldDirty: true });
    methods?.setValue("subject_model", false, { shouldDirty: true });
  };

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "title", headerName: __("Title", "acadlix"), flex: 2, minWidth: 150 },
    {
      field: "mode",
      headerName: __("Mode", "acadlix"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let mode = params?.value;
        let label = '';
        let color = '';
        switch (mode) {
          case "normal":
            label = __("Normal", "acadlix");
            color = "primary";
            break;
          case "check_and_continue":
            label = __("Check and continue", "acadlix");
            color = "warning";
            break;
          case "question_below_each_other":
            label = __("Question below each other", "acadlix");
            color = "info";
            break;
          case "advance_mode":
            label = __("Advance mode", "acadlix");
            color = "success";
            break;
          default:
            label = __("Normal", "acadlix");
            color = "primary";
            break;
        }
        return <><Chip label={label} color={color} variant="filled" /></>;
      },
    },
    { field: "category", headerName: __("Category", "acadlix"), flex: 1, minWidth: 90 },
    {
      field: "shortcode",
      headerName: __("Shortcode", "acadlix"),
      flex: 2,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title={__("Copy Shortcode", "acadlix")} arrow>
              <IconButton
                onClick={() => {
                  navigator?.clipboard
                    ?.writeText(params?.value)
                    .then(function () {
                      toast.success(__("Shortcode copied to clipboard!", "acadlix"));
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
    {
      field: "total_questions",
      headerName: __("Questions", "acadlix"),
      flex: 1,
      minWidth: 80,
    },
    {
      field: "action",
      headerName: __("Action", "acadlix"),
      sortable: false,
      flex: 2,
      minWidth: isMobile ? 220 : 200,
      renderCell: (params) => {
        return (
          <>
            {
              hasCapability("acadlix_edit_quiz") &&
              <Tooltip title={__("Edit Quiz", "acadlix")} arrow>
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
              hasCapability("acadlix_delete_quiz") &&
              <Tooltip title={__("Delete Quiz", "acadlix")} arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={deleteQuizById.bind(this, params?.id)}
                >
                  <FaTrash />
                </IconButton>
              </Tooltip>
            }
            {
              hasCapability("acadlix_show_question") &&
              <Tooltip title={__("Questions", "acadlix")} arrow>
                <IconButton
                  aria-label="questions"
                  size="small"
                  color="secondary"
                  LinkComponent={Link}
                  to={`/${params?.id}/question`}
                >
                  <FaQuestion />
                </IconButton>
              </Tooltip>
            }
            <React.Suspense fallback={null}>
              <PragraphOptionButton
                params={params}
              />
            </React.Suspense>
            {
              hasCapability("acadlix_show_statistic") &&
              <Tooltip title={__("Result", "acadlix")} arrow>
                <IconButton
                  aria-label="result"
                  size="small"
                  color="info"
                  LinkComponent={Link}
                  to={`/${params?.id}/result`}
                >
                  <LuFileChartColumn />
                </IconButton>
              </Tooltip>
            }
            {
              hasCapability("acadlix_show_leaderboard") &&
              <Tooltip title={__("Leaderboard", "acadlix")} arrow>
                <IconButton
                  aria-label="leaderboard"
                  size="small"
                  color="warning"
                  LinkComponent={Link}
                  to={`/${params?.id}/leaderboard`}
                >
                  <FaRankingStar />
                </IconButton>
              </Tooltip>
            }
            {params?.row?.mode === "advance_mode" &&
              hasCapability("acadlix_subject_wise_action_quiz") &&
              (
                <React.Suspense fallback={null}>
                  <SubjectOptionButton
                    {...methods}
                    params={params}
                  />
                </React.Suspense>
              )}
          </>
        );
      },
    },
  ];

  const { isFetching, data, refetch } = GetQuizes(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search"),
  );


  React.useMemo(() => {
    if (Array.isArray(data?.data?.quizes)) {
      const newRows = data?.data?.quizes?.map((quiz) => {
        return {
          id: quiz?.ID,
          title: quiz?.post_title,
          mode: quiz?.rendered_metas?.mode,
          category: quiz?.category?.name ?? "Uncategorized",
          shortcode: `[Acadlix_Quiz ${quiz?.quiz_shortcode?.id}]`,
          total_questions: quiz?.questions_count,
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

  const deleteBulkMutation = DeleteBulkQuiz();
  const handleBulkDelete = () => {
    if (confirm(__("Do you really want to delete these quizzes?", "acadlix"))) {
      deleteBulkMutation?.mutate(
        {
          quiz_ids: methods?.watch("quiz_ids"),
        },
        {
          onSettled: () => {
            methods?.setValue("action", "", { shouldDirty: true });
            methods?.setValue("quiz_ids", [], { shouldDirty: true });
          },
        }
      );
    }
  };

  const handleCategory = () => {
    methods?.setValue("category_model", true, { shouldDirty: true });
  };

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

  const handleBulkAction = () => {
    if (methods?.watch("action")) {
      methods?.clearErrors("action");
      if (methods?.watch("quiz_ids")?.length > 0) {
        switch (methods?.watch("action")) {
          case "delete":
            handleBulkDelete();
            break;
          case "set_category":
            handleCategory();
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

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "100%",
    },
  }));

  const handleClose = () => {
    methods?.setValue("category_model", false, { shouldDirty: true });
  };

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminQuizPage', model.page);
    localStorage.setItem('adminQuizPageSize', model.pageSize);
  };

  return (
    <Box>
      {!isFetching && (
        <BootstrapDialog
          open={methods?.watch("category_model")}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <CategoryModel {...methods} handleClose={handleClose} />
        </BootstrapDialog>
      )}
      <BootstrapDialog
        open={methods?.watch("subject_model")}
        onClose={handleSubjectTimeClose}
        aria-labelledby="alert-subject-title"
        aria-describedby="alert-subject-description"
      >
        <React.Suspense fallback={null}>
          <SubjectTimeModel {...methods} handleClose={handleSubjectTimeClose} />
        </React.Suspense>
      </BootstrapDialog>
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
                    {__("Quiz Overview", "acadlix")}
                  </Typography>
                  {
                    hasCapability("acadlix_add_quiz") &&
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
                  justifyContent: hasCapability("acadlix_bulk_action_quiz")
                    ? "space-between"
                    : "flex-end",
                }}
              >
                {
                  hasCapability("acadlix_bulk_action_quiz") &&
                  <Box sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "baseline",
                  }}>
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
                          hasCapability("acadlix_bulk_delete_quiz") &&
                          <MenuItem value="delete">{__("Delete", "acadlix")}</MenuItem>
                        }
                        {
                          hasCapability("acadlix_bulk_set_category_quiz") &&
                          <MenuItem value="set_category">{__("Set Category", "acadlix")}</MenuItem>
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
                    fullWidth
                    size="small"
                    label={__("Search", "acadlix")}
                    helperText={__("Search by title, id, category", "acadlix")}
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
                    methods?.setValue("quiz_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("quiz_ids")}
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

export default Quiz;
