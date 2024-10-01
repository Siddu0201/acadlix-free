import { Box, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";

const Order = () => {
  const methods = useForm({
    defaultValues: {
      rows: [],
      order_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "order_id", headerName: "Order ID", flex: 2, minWidth: 130 },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 2,
      minWidth: 180,
    },
  ];

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

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
              title="Orders"
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
                  rowCount={0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("lesson_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("lesson_ids")}
                  autoHeight
                  loading={false}
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

export default Order;
