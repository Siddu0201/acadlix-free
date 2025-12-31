import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  DeleteBulkLesson,
  DeleteLessonById,
  GetLessons,
} from "@acadlix/requests/admin/AdminLessonRequest";
import { 
  FaEdit, 
  FaSearch, 
  FaTrash, 
} from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const Lesson = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminLessonPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminLessonPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      lesson_ids: [],
      action: "",
    },
  });
  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteLessonById();
  const deleteLessonById = (id) => {
    if (confirm(__("Deleting this lesson will permanently remove all associated data. Are you sure you want to proceed?", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  };

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    { field: "title", headerName: __("Title", "acadlix"), flex: 2, minWidth: 130 },
    { field: "type", headerName: __("Type", "acadlix"), flex: 2, minWidth: 100 },
    {
      field: "total_resources",
      headerName: __("No. of resources", "acadlix"),
      flex: 2,
      minWidth: 130,
    },
    {
      field: "action",
      headerName: __("Action", "acadlix"),
      sortable: false,
      flex: 2,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            {
              hasCapability("acadlix_edit_lesson") &&
              <Tooltip title={__("Edit Lesson", "acadlix")} arrow>
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
              hasCapability("acadlix_delete_lesson") &&
              <Tooltip title={__("Delete Lesson", "acadlix")} arrow>
                <IconButton
                  aria-label="delete"
                  size="small"
                  color="error"
                  onClick={deleteLessonById.bind(this, params?.id)}
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

  const { isFetching, data, refetch } = GetLessons(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search")
  );

  React.useMemo(() => {
    if (Array.isArray(data?.data?.lessons)) {
      const newRows = data?.data?.lessons?.map((lesson) => {
        return {
          id: lesson?.ID,
          title: lesson?.post_title,
          type: lesson?.rendered_metas?.type,
          total_resources: lesson?.resource_count,
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

  const deleteBulkMutation = DeleteBulkLesson();
  const handleBulkDelete = () => {
    if (
      confirm(
        __("Deleting these lesson(s) will permanently remove all associated data. Are you sure you want to proceed?", "acadlix")
      )
    ) {
      deleteBulkMutation?.mutate(
        {
          lesson_ids: methods?.watch("lesson_ids"),
        },
        {
          onSettled: () => {
            methods?.setValue("action", "", { shouldDirty: true });
            methods?.setValue("lesson_ids", [], { shouldDirty: true });
          },
        }
      );
    }
  };

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

  const handleBulkAction = () => {
    if (methods?.watch("action")) {
      methods?.clearErrors("action");
      if (methods?.watch("lesson_ids")?.length > 0) {
        switch (methods?.watch("action")) {
          case "delete":
            handleBulkDelete();
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

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminLessonPage', model.page);
    localStorage.setItem('adminLessonPageSize', model.pageSize);
  };

  return (
    <Box>
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
                    {__("Lesson Overview", "acadlix")}
                  </Typography>
                  {
                    hasCapability("acadlix_add_lesson") &&
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
                  justifyContent: hasCapability("acadlix_bulk_action_lesson")
                    ? "space-between"
                    : "flex-end"
                }}
              >
                {
                  hasCapability("acadlix_bulk_action_lesson") &&
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
                          hasCapability("acadlix_bulk_delete_lesson") &&
                          <MenuItem value="delete">{__("Delete", "acadlix")}</MenuItem>
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
                    label={__("Search", "acadlix")}
                    helperText={__("Search by title", "acadlix")}
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
                    methods?.setValue("lesson_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("lesson_ids")}
                  autoHeight
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

export default Lesson;
