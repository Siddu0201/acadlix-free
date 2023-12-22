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

const Question = () => {

  const [pageSize, setPageSize] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "title", headerName: "Title", flex: 2, minWidth: 150 },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 100 },
    { field: "points", headerName: "Points", flex: 1, minWidth: 100 },
    { field: "negative_points", headerName: "Negative Points", flex: 1, minWidth: 100 },
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
                  paddingBottom: 2
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to="/question/create"
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
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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

export default Question;
