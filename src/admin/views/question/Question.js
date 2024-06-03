import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import {
  DeleteQuizQuestionById,
  GetQuizQuestion,
} from "../../../requests/admin/AdminQuestionRequest";
import { FaEdit, FaTrash } from "react-icons/fa";

const Question = () => {
  const [rows, setRows] = React.useState([]);
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
    { field: "id", headerName: "ID", hide: true },
    { field: "title", headerName: "Title", flex: 2, minWidth: 150 },
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
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Edit Question" arrow>
              <IconButton
                aria-label="edit"
                size="small"
                LinkComponent={Link}
                to={`/quiz/${quiz_id}/question/edit/${params?.id}`}
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Question" arrow>
              <IconButton
                aria-label="delete"
                size="small"
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
  React.useMemo(() => {
    if (Array.isArray(data?.data?.questions)) {
      const newRows = data?.data?.questions?.map((question) => {
        return {
          id: question?.id,
          title: question?.title,
          subject: question?.subject?.subject_name ?? "Uncategorized",
          points: question?.points,
          negative_points: question?.negative_points,
        };
      });
      setRows(() => [...newRows]);
    }
  }, [data, setRows]);

  return (
    <Box>
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
            to="/quiz"
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Card>
            <CardHeader
              title="Question Overview"
              sx={{
                paddingX: 4,
                paddingY: 2,
                paddingBottom: 1,
              }}
            ></CardHeader>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 2,
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to={`/quiz/${quiz_id}/question/create`}
                    sx={{
                      marginRight: 2,
                    }}
                    color="primary"
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <DataGrid
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableSelectionOnClick
                  pagination
                  autoHeight
                  rows={rows}
                  columns={columns}
                  loading={isFetching}
                  rowCount={1}
                  columnVisibilityModel={{
                    id: false,
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
