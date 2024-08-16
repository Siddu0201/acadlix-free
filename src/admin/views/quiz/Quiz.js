import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { Link } from "react-router-dom";
import {
  DeleteBulkQuiz,
  DeleteQuizById,
  GetQuizes,
} from "../../../requests/admin/AdminQuizRequest";
import { FaEdit, FaParagraph, FaQuestion, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CategoryModel from "./actions/CategoryModel";
import { LuFileBarChart2, LuFileClock } from "react-icons/lu";
import { FaRankingStar } from "react-icons/fa6";
import SubjectTimeModel from "./actions/SubjectTimeModel";
import { MdFileCopy } from "react-icons/md";

const Quiz = () => {
  const methods = useForm({
    defaultValues: {
      rows: [],
      quiz_ids: [],
      action: "",
      category_model: false,
      subject_model: false,
      quiz_id: null,
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const deleteMutation = DeleteQuizById();
  const deleteQuizById = (id) => {
    if (confirm("Do you really want to delete this quiz?")) {
      deleteMutation?.mutate(id);
    }
  };

  const handleSubjectTime = (id) => {
    methods?.setValue("quiz_id", id, { shouldDirty: true });
    methods?.setValue("subject_model", true, { shouldDirty: true });
  };

  const handleSubjectTimeClose = () => {
    methods?.setValue("quiz_id", null, { shouldDirty: true });
    methods?.setValue("subject_model", false, { shouldDirty: true });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 2, minWidth: 130 },
    {
      field: "mode",
      headerName: "Mode",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return <>{getMode(params?.value)}</>;
      },
    },
    { field: "category", headerName: "Category", flex: 1, minWidth: 90 },
    {
      field: "shortcode",
      headerName: "Shortcode",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Copy Shortcode" arrow>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(params.value);
                  toast.success("Shortcode copied to clipboard!");
                }}
                size="small"
              >
                <MdFileCopy />
              </IconButton>
            </Tooltip>
            {params.value}
          </div>
        );
      },
    },
    {
      field: "total_questions",
      headerName: "Total Questions",
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
            <Tooltip title="Edit Quiz" arrow>
              <IconButton
                aria-label="edit"
                size="small"
                color="primary"
                LinkComponent={Link}
                to={`/quiz/edit/${params?.id}`}
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Quiz" arrow>
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={deleteQuizById.bind(this, params?.id)}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
            <Tooltip title="Questions" arrow>
              <IconButton
                aria-label="questions"
                size="small"
                color="secondary"
                LinkComponent={Link}
                to={`/quiz/${params?.id}/question`}
              >
                <FaQuestion />
              </IconButton>
            </Tooltip>
            <Tooltip title="Paragraphs" arrow>
              <IconButton
                aria-label="paragraphs"
                size="small"
                color="grey"
                LinkComponent={Link}
                to={`/quiz/${params?.id}/paragraph`}
              >
                <FaParagraph />
              </IconButton>
            </Tooltip>
            <Tooltip title="Result" arrow>
              <IconButton
                aria-label="result"
                size="small"
                color="info"
                LinkComponent={Link}
                to={`/quiz/${params?.id}/result`}
              >
                <LuFileBarChart2 />
              </IconButton>
            </Tooltip>
            <Tooltip title="Leaderboard" arrow>
              <IconButton
                aria-label="leaderboard"
                size="small"
                color="warning"
                LinkComponent={Link}
                to={`/quiz/${params?.id}/leaderboard`}
              >
                <FaRankingStar />
              </IconButton>
            </Tooltip>
            {params?.row?.mode === "advance_mode" && (
              <Tooltip title="Subject Timing" arrow>
                <IconButton
                  aria-label="subject_time"
                  size="small"
                  color="grey"
                  onClick={handleSubjectTime.bind(this, params?.id)}
                >
                  <LuFileClock />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  const { isFetching, data } = GetQuizes(
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const getMode = (mode = "") => {
    switch (mode) {
      case "normal":
        return "Normal";
      case "check_and_continue":
        return "Check and continue";
      case "question_below_each_other":
        return "Question below each other";
      case "advance_mode":
        return "Advance mode";
      default:
        return "Normal";
    }
  };

  React.useMemo(() => {
    if (Array.isArray(data?.data?.quizes)) {
      const newRows = data?.data?.quizes?.map((quiz) => {
        return {
          id: quiz?.id,
          title: quiz?.title,
          mode: quiz?.mode,
          category: quiz?.category?.category_name ?? "Uncategorized",
          shortcode: `[Acadlix_Quiz ${quiz?.id}]`,
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
    if (confirm("Do you really want to delete these quizzes?")) {
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

  const handleClose = () => {
    methods?.setValue("category_model", false, { shouldDirty: true });
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
        <SubjectTimeModel {...methods} handleClose={handleSubjectTimeClose} />
      </BootstrapDialog>
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
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
                    Quiz Overview
                  </Typography>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to="/quiz/create"
                    sx={{
                      marginRight: 2,
                    }}
                    color="primary"
                  >
                    Add
                  </Button>
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
                      <MenuItem value="set_category">Set Category</MenuItem>
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
                    methods?.setValue("quiz_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("quiz_ids")}
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

export default Quiz;
