import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  DeleteBulkQuestion,
  DeleteQuizQuestionById,
  GetQuizQuestion,
} from "@acadlix/requests/admin/AdminQuestionRequest";
import { FaEdit, FaSearch, FaTrash, TiArrowLeftThick } from "@acadlix/helpers/icons";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubjectAndPointModel from "./actions/SubjectAndPointModel";
import { __, sprintf } from "@wordpress/i18n";
import { getStripHtml, hasCapability } from "@acadlix/helpers/util";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const CopyQuestionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_copy_question_button" */
        "@acadlix/pro/admin/question/CopyQuestionButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_copy_question_button" */
        "@acadlix/free/admin/question/CopyQuestionButton"
      )
);

const BulkImportButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_bulk_import_button" */
        "@acadlix/pro/admin/question/BulkImportButton"
      )
    : import(
        /* webpackChunkName: "admin_quiz_free_bulk_import_button" */
        "@acadlix/free/admin/question/BulkImportButton"
      )
);

const ParagraphModel = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "admin_quiz_pro_paragraph_model" */
        "@acadlix/pro/admin/question/actions/ParagraphModel"
      )
    : Promise.resolve({ default: () => null })
);

const Question = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminQuestionPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminQuestionPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      title: "",
      rows: [],
      question_ids: [],
      action: "",
      subject_and_point_model: false,
      paragraph_model: false,
    },
  });
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const { quiz_id } = useParams();

  const deleteMutation = DeleteQuizQuestionById(quiz_id);
  const deleteQuestionById = (question_id) => {
    if (confirm(__('Do you really want to delete this question?', 'acadlix'))) {
      deleteMutation?.mutate(question_id);
    }
  };

  const columns = [
    { field: "id", headerName: __("ID", "acadlix"), flex: 1, minWidth: 50 },
    { field: "title", headerName: __("Title", "acadlix"), flex: 2, minWidth: 130 },
    { field: "type", headerName: __("Type", "acadlix"), flex: 1, minWidth: 100 },
    { field: "subject", headerName: __("Subject", "acadlix"), flex: 1, minWidth: 100 },
    { field: "points", headerName: __("Points", "acadlix"), flex: 1, minWidth: 100 },
    {
      field: "negative_points",
      headerName: __("Negative Points", "acadlix"),
      flex: 1,
      minWidth: 100,
    },
    {
      field: "action",
      headerName: __("Action", "acadlix"),
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <>
            {
              hasCapability("acadlix_edit_question") &&
              <Tooltip title={__("Edit Question", "acadlix")} arrow>
                <IconButton
                  aria-label="edit"
                  size="small"
                  color="primary"
                  LinkComponent={Link}
                  to={`/${quiz_id}/question/edit/${params?.id}`}
                >
                  <FaEdit />
                </IconButton>
              </Tooltip>
            }
            {
              hasCapability("acadlix_delete_question") &&
              <Tooltip title={__("Delete Question", "acadlix")} arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={deleteQuestionById.bind(this, params?.id)}
                >
                  <FaTrash />
                </IconButton>
              </Tooltip>
            }
          </>
        );
      },
    },
  ];

  const { isFetching, data, refetch } = GetQuizQuestion(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search")
  );

  const getType = (type = "") => {
    switch (type) {
      case "singleChoice":
        return __("Single Choice", "acadlix");
      case "multipleChoice":
        return __("Multiple Choice", "acadlix");
      case "trueFalse":
        return __("True False", "acadlix");
      case "freeChoice":
        return __("Free Choice", "acadlix");
      case "sortingChoice":
        return __("Sorting Choice", "acadlix");
      case "matrixSortingChoice":
        return __("Matrix Sorting Choice", "acadlix");
      case "fillInTheBlank":
        return __("Fill in the blank", "acadlix");
      case "numerical":
        return __("Numerical", "acadlix");
      case "rangeType":
        return __("Range Type", "acadlix");
      case "paragraph":
        return __("Paragraph", "acadlix");
      default:
        return "";
    }
  };

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.questions)) {
      const newRows = data?.data?.questions?.map((question) => {
        return {
          id: question?.id,
          title: question?.title
            ? question?.title
            : getStripHtml(
              question?.question_languages
                ?.filter((d) => d?.default)?.[0]
                ?.question.substring(0, 50)
            ),
          type: getType(question?.answer_type),
          subject: question?.subject?.subject_name ?? "Uncategorized",
          points: question?.points,
          negative_points: question?.negative_points,
        };
      });
      methods.setValue("rows", newRows, { shouldDirty: true });
    }
    if (data?.data?.quiz) {
      methods.setValue("title", data?.data?.quiz?.post_title, { shouldDirty: true });
    }
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const deleteBulkMutation = DeleteBulkQuestion(quiz_id);
  const handleBulkDelete = () => {
    if (confirm(__("Do you really want to delete these questions?", "acadlix"))) {
      deleteBulkMutation?.mutate(
        {
          question_ids: methods?.watch("question_ids"),
        },
        {
          onSettled: () => {
            methods?.setValue("action", "", { shouldDirty: true });
            methods?.setValue("question_ids", [], { shouldDirty: true });
          },
        }
      );
    }
  };

  const handleSetSubjectAndPoints = () => {
    methods?.setValue("subject_and_point_model", true, { shouldDirty: true });
  };

  const handleSetParagraph = () => {
    methods?.setValue("paragraph_model", true, { shouldDirty: true });
  };

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

  const handleBulkAction = () => {
    if (methods?.watch("action")) {
      methods?.clearErrors("action");
      if (methods?.watch("question_ids")?.length > 0) {
        switch (methods?.watch("action")) {
          case "delete":
            handleBulkDelete();
            break;
          case "set_subject_and_points":
            handleSetSubjectAndPoints();
            break;
          case "set_paragraph":
            handleSetParagraph();
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
  };

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

  const handleSubjectClose = () => {
    methods?.setValue("subject_and_point_model", false, { shouldDirty: true });
  };

  const handleParagraphClose = () => {
    methods?.setValue("paragraph_model", false, { shouldDirty: true });
  };

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminQuestionPage', model.page);
    localStorage.setItem('adminQuestionPageSize', model.pageSize);
  };

  return (
    <Box>
      {!isFetching && (
        <>
          <BootstrapDialog
            open={methods?.watch("subject_and_point_model")}
            onClose={handleSubjectClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <SubjectAndPointModel
              {...methods}
              handleClose={handleSubjectClose}
              quiz_id={quiz_id}
            />
          </BootstrapDialog>
          <BootstrapDialog
            open={methods?.watch("paragraph_model")}
            onClose={handleParagraphClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <React.Suspense fallback={null}>
              <ParagraphModel
                {...methods}
                handleClose={handleParagraphClose}
                quiz_id={quiz_id}
                paragraphs={data?.data?.paragraphs}
              />
            </React.Suspense>
          </BootstrapDialog>
        </>
      )}
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
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to="/"
          >
            {__('Back', 'acadlix')}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                  >
                    {sprintf(
                      /* translators: %s is the quiz title */
                      __("Question Overview (%s)", "acadlix"),
                      methods?.watch("title")
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >

                    {
                      hasCapability("acadlix_add_question") &&
                      <Button
                        variant="contained"
                        LinkComponent={Link}
                        to={`/${quiz_id}/question/create`}
                        color="primary"
                      >
                        {__("Add", "acadlix")}
                      </Button>
                    }
                    <CustomRefresh
                      refetch={refetch}
                    />
                    <React.Suspense fallback={null}>
                      <CopyQuestionButton quiz_id={quiz_id} />
                    </React.Suspense>
                    <React.Suspense fallback={null}>
                      <BulkImportButton quiz_id={quiz_id} />
                    </React.Suspense>
                  </Box>
                </Box>
              }
              sx={{
                paddingX: 4,
                paddingY: 2,
                paddingBottom: 1,
              }}
            ></CardHeader>
            <CardContent>
              <>
                <Box
                  sx={{
                    paddingBottom: 2,
                    display: {
                      xs: "block",
                      sm: "flex",
                    },
                    gap: 2,
                    alignItems: "flex-start",
                    justifyContent: hasCapability("acadlix_bulk_action_question")
                      ? "space-between"
                      : "flex-end",
                  }}
                >
                  {hasCapability("acadlix_bulk_action_question") && (

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
                        <React.Suspense fallback={null}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={methods?.watch("action")}
                            label={__("Bulk Actions", "acadlix")}
                            onChange={handleActionChange}
                          >
                            <MenuItem value="">
                              {__("Bulk Actions", "acadlix")}
                            </MenuItem>
                            {
                              hasCapability("acadlix_bulk_delete_question") &&
                              <MenuItem value="delete">{__("Delete", "acadlix")}</MenuItem>
                            }
                            {
                              hasCapability("acadlix_bulk_set_subject_and_point_question") &&
                              <MenuItem value="set_subject_and_points">
                                {__("Set Subject and Points", "acadlix")}
                              </MenuItem>
                            }
                            {
                              hasCapability("acadlix_bulk_set_paragraph_question") &&
                              <MenuItem value="set_paragraph" disabled={!acadlixOptions?.isActive}>
                                {__("Set Paragraph", "acadlix")}
                              </MenuItem>
                            }
                          </Select>
                        </React.Suspense>
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
                  )}

                  <Box>
                    <CustomTextField
                      label={__("Search", "acadlix")}
                      helperText={__("Search by question text/title", "acadlix")}
                      fullWidth
                      size="small"
                      value={methods?.watch("search")}
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
              </>
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
                    methods.setValue("question_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("question_ids")}
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

export default Question;
