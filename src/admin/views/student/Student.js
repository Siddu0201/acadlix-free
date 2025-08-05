import { Box, Button, Card, CardContent, CardHeader, InputAdornment, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { hasCapability } from '@acadlix/helpers/util';
import { GetStudents } from '@acadlix/requests/admin/AdminStudentRequest';
import { FaSearch, IoMdRefresh } from '@acadlix/helpers/icons';
import { DataGrid } from '@mui/x-data-grid';
import CustomTextField from '@acadlix/components/CustomTextField';

const Student = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminStudentPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminStudentPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      student_ids: [],
      action: "",
    },
  });
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  let columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "name", headerName: __("Name", "acadlix"), flex: 2, minWidth: 130 },
    { field: "email", headerName: __("Email", "acadlix"), flex: 2, minWidth: 130 },
    { field: "registration_date", headerName: __("Registration Date", "acadlix"), flex: 2, minWidth: 130 },
    { field: "course_count", headerName: __("Course Count", "acadlix"), flex: 2, minWidth: 130 },
    // { field: "action", headerName: __("Action", "acadlix"), sortable: false, flex: 2, minWidth: 100 },
  ];

  let filteredColumn = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.student.columns", 
    columns,
  ) ?? columns;

  const { isFetching, data, refetch } = GetStudents(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search")
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.students)) {
      const newRows = data?.data?.students?.map((student) => {
        return {
          id: student?.ID,
          name: student?.display_name,
          email: student?.user_email,
          registration_date: student?.user_registered,
          course_count: student?.course_count,
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

  const handleSearch = (e) => {
    methods.setValue("search", e?.target?.value, { shouldDirty: true });
  };

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminStudentPage', model.page);
    localStorage.setItem('adminStudentPageSize', model.pageSize);
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
                    {__("Student Overview", "acadlix")}
                  </Typography>
                  <Tooltip title={__("Refresh", "acadlix")} arrow>
                    <Button variant="contained" onClick={refetch}>
                      <IoMdRefresh style={{ fontSize: "x-large" }} />
                    </Button>
                  </Tooltip>
                </Box>
              }
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Box>
                  <CustomTextField
                    label={__("Search", "acadlix")}
                    helperText={__("Search by name, email", "acadlix")}
                    fullWidth
                    size="small"
                    type="search"
                    value={methods?.watch("search")}
                    onChange={handleSearch}
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
                  height: "100%",
                }}
              >
                <DataGrid
                  rows={methods?.watch("rows")}
                  columns={filteredColumn}
                  rowCount={rowCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={handlePaginationChange}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50, 100]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  disableColumnMenu
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("student_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("student_ids")}
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
  )
}

export default Student