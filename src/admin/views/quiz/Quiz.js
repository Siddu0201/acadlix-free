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
import { Link } from "react-router-dom";
import { DeleteQuizById, GetQuizes } from "../../../requests/admin/AdminQuizRequest";
import {FaEdit, FaQuestion, FaTrash} from 'react-icons/fa'

const Quiz = () => {

  const [rows, setRows] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [rowSelection, setRowSelection] = React.useState([]);

  const deleteMutation = DeleteQuizById();
  const deleteQuizById = (id) => {
    if(confirm("Do you really want to delete this quiz?")){
      deleteMutation?.mutate(id)
    }
  }


  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 2, minWidth: 150 },
    { field: "category", headerName: "Category", flex: 1, minWidth: 100  },
    { field: "shortcode", headerName: "Shortcode", flex: 1, minWidth: 100 },
    {
      field: "total_questions",
      headerName: "Total Questions",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Edit Quiz" arrow>
              <IconButton
                aria-label="edit"
                size="small"
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
                onClick={deleteQuizById.bind(this, params?.id)}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
            <Tooltip title="Questions" arrow>
              <IconButton
                aria-label="questions"
                size="small"
                LinkComponent={Link}
                to={`/quiz/${params?.id}/question`}
              >
                <FaQuestion />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];


  const { isFetching, data } = GetQuizes(paginationModel?.page, paginationModel?.pageSize);
  React.useMemo(() => {
    if (Array.isArray(data?.data?.quizes)) {
      const newRows = data?.data?.quizes?.map((quiz) => {
        return {
          id: quiz?.id,
          title: quiz?.title,
          category: quiz?.category?.category_name ?? 'Uncategorized',
          shortcode: `[Acadlix_Quiz ${quiz?.id}]`,
          total_questions: quiz?.questions_count,
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
          <Card>
            <CardHeader
              title="Quiz Overview"
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
                    to="/quiz/create"
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
                  rows={rows}
                  columns={columns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    setRowSelection(data)
                  }}
                  rowSelectionModel={rowSelection}
                  pagination
                  autoHeight
                  loading={isFetching}
                  rowCount={data?.data?.total}
                  columnVisibilityModel={{
                    id: false,
                  }}
                  sx={{
                    '& .PrivateSwitchBase-input': {
                      height: '100% !important',
                      width: '100% !important',
                      margin: "0 !important",
                    }
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
