import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import {
  DeleteBulkQuestion,
  DeleteQuizQuestionById,
  GetQuizQuestion,
} from "../../../requests/admin/AdminQuestionRequest";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubjectAndPointModel from "./actions/SubjectAndPointModel";
import ParagraphModel from "./actions/ParagraphModel";

const Question = () => {
  const methods = useForm({
    defaultValues: {
      rows: [],
      question_ids: [],
      action: "",
      subject_and_point_model: false,
      paragraph_model: false,
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const { quiz_id } = useParams();

  const deleteMutation = DeleteQuizQuestionById(quiz_id);
  const deleteQuestionById = (question_id) => {
    if (confirm("Do you really want to delete this question?")) {
      deleteMutation?.mutate(question_id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 2, minWidth: 130 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 100 },
    { field: "points", headerName: "Points", flex: 1, minWidth: 100 },
    {
      field: "negative_points",
      headerName: "Negative Points",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Edit Question" arrow>
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
            <Tooltip title="Delete Question" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={deleteQuestionById.bind(this, params?.id)}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const { isFetching, data } = GetQuizQuestion(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const getType = (type = "") => {
    switch (type) {
      case "singleChoice":
        return "Single Choice";
      case "multipleChoice":
        return "Multiple Choice";
      case "trueFalse":
        return "True False";
      case "sortingChoice":
        return "Sorting Choice";
      case "matrixSortingChoice":
        return "Matrix Sorting Choice";
      case "fillInTheBlank":
        return "Fill in the blank";
      case "numerical":
        return "Numerical";
      case "rangeType":
        return "Range Type";
      case "paragraph":
        return "Paragraph";
      default:
        return "";
    }
  };

  function strip(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.questions)) {
      const newRows = data?.data?.questions?.map((question) => {
        return {
          id: question?.id,
          title: question?.title
            ? question?.title
            : strip(
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
    if (confirm("Do you really want to delete these questions?")) {
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
        toast.error("Please select atleast 1 entry.", {
          position: "bottom-left",
        });
      }
    } else {
      methods?.setError("action", {
        type: "custom",
        message: "Action required",
      });
    }
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
            <ParagraphModel
              {...methods}
              handleClose={handleParagraphClose}
              quiz_id={quiz_id}
              paragraphs={data?.data?.paragraphs}
            />
          </BootstrapDialog>
        </>
      )}
      <Grid
        container
        rowSpacing={3}
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
            to="/"
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Card>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  >
                    Question Overview
                  </Typography>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to={`/${quiz_id}/question/create`}
                    sx={{
                      marginRight: 2,
                    }}
                    color="primary"
                  >
                    Add
                  </Button>
                  {acadlixOptions?.is_abqu_active && (
                    <Button
                      variant="contained"
                      LinkComponent="a"
                      href={acadlixOptions?.abqu_url}
                      sx={{
                        marginRight: 2,
                      }}
                      color="primary"
                    >
                      Import from .docx
                    </Button>
                  )}
                </Box>
              }
              sx={{
                paddingX: 4,
                paddingY: 2,
                paddingBottom: 1,
              }}
            ></CardHeader>
            <CardContent>
              {methods?.watch("rows")?.length > 0 && (
                <>
                  <Box
                    sx={{
                      paddingBottom: 2,
                    }}
                  >
                    <Box
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
                          <MenuItem value="set_subject_and_points">
                            Set Subject and Points
                          </MenuItem>
                          <MenuItem value="set_paragraph">
                            Set Paragraph
                          </MenuItem>
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
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
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
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods.setValue("question_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("question_ids")}
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

export default Question;
