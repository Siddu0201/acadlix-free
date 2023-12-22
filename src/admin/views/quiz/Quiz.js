import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Link } from "react-router-dom";

const Quiz = () => {
  const [rows, setRows] = React.useState([
    {id: 1, title: "dsfsdg", category: 'fdsfd', shortcode: "fsdfdsf", total_questions: 3, action: "fsdf" },
    {id: 2, title: "dsfsdg", category: 'fdsfd', shortcode: "fsdfdsf", total_questions: 3, action: "fsdf" },
    {id: 3, title: "dsfsdg", category: 'fdsfd', shortcode: "fsdfdsf", total_questions: 3, action: "fsdf" },
    {id: 4, title: "dsfsdg", category: 'fdsfd', shortcode: "fsdfdsf", total_questions: 3, action: "fsdf" },
  ]);

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "title", headerName: "Title", flex: 2, minWidth: 150 },
    { field: "category", headerName: "Category", flex: 1, minWidth: 100 },
    { field: "shortcode", headerName: "Shortcode", flex: 1, minWidth: 100 },
    { field: "total_questions", headerName: "Total Questions", flex: 1, minWidth: 80 },
    { field: "action", headerName: "Action", flex: 1, minWidth: 80 },
  ];

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
                  paddingBottom: 2
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
                    Create
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <DataGrid
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10}}
                  }}
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableSelectionOnClick
                  pagination
                  autoHeight
                  rows={rows}
                  columns={columns}
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
