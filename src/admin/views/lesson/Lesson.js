import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  DeleteBulkLesson,
  DeleteLessonById,
  GetLessons,
} from "../../../requests/admin/AdminLessonRequest";
import { FaEdit, FaTrash, IoMdRefresh } from "../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const Lesson = () => {
  const methods = useForm({
    defaultValues: {
      rows: [],
      lesson_ids: [],
      action: "",
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const deleteMutation = DeleteLessonById();
  const deleteLessonById = (id) => {
    if (confirm(__("Do you really want to delete this lesson?", "acadlix"))) {
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
          </>
        );
      },
    },
  ];

  const { isFetching, data, refetch } = GetLessons(
    paginationModel?.page,
    paginationModel?.pageSize
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
        __("Do you really want to delete these lesson(s)?", "acadlix")
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
              title={
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  >
                    {__("Lesson Overview", "acadlix")}
                  </Typography>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to="/create"
                    color="primary"
                  >
                    {__("Add", "acadlix")}
                  </Button>
                  <Tooltip title={__("Refresh", "acadlix")} arrow>
                    <Button variant="contained" onClick={refetch} size="large">
                      <IoMdRefresh />
                    </Button>
                  </Tooltip>
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
                      <MenuItem value="delete">{__("Delete", "acadlix")}</MenuItem>
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
