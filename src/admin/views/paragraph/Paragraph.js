import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import {
  DeleteBulkParagraph,
  DeleteQuizParagraphById,
  GetQuizParagraphs,
} from "../../../requests/admin/AdminParagraphRequest";
import { FaEdit, FaTrash, TiArrowLeftThick, IoMdRefresh } from "../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const Paragraph = () => {
  const methods = useForm({
    defaultValues: {
      rows: [],
      paragraph_ids: [],
      action: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const { quiz_id } = useParams();

  const deleteMutation = DeleteQuizParagraphById(quiz_id);
  const deleteParagraphById = (id) => {
    if (confirm(__("Do you really want to delete this paragraph?", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  };

  const columns = [
    { field: "id", headerName: __("ID", "acadlix"), flex: 1, minWidth: 80 },
    { field: "title", headerName: __("Title", "acadlix"), flex: 1, minWidth: 130 },
    { field: "content", headerName: __("Content", "acadlix"), flex: 2, minWidth: 180 },
    {
      field: "no_of_questions",
      headerName: __("No. of assigned questions", "acadlix"),
      flex: 1,
      minWidth: 130,
    },
    {
      field: "action",
      headerName: __("Action", "acadlix"),
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title={__("Edit Paragraph", "acadlix")} arrow>
              <IconButton
                aria-label="edit"
                size="small"
                color="primary"
                LinkComponent={Link}
                to={`/${quiz_id}/paragraph/edit/${params?.id}`}
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title={__("Delete Paragraph", "acadlix")} arrow>
              <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={deleteParagraphById.bind(this, params?.id)}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const { isFetching, data, refetch } = GetQuizParagraphs(
    quiz_id,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  function strip(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.paragraphs)) {
      const newRows = data?.data?.paragraphs?.map((paragraph) => {
        let default_lang = {};
        default_lang = paragraph?.rendered_metas?.language_data?.find(
          (l) => l?.default
        );
        return {
          id: paragraph?.ID,
          title:
            paragraph?.post_title?.length > 50
              ? strip(paragraph?.post_title?.substring(0, 50))
              : strip(paragraph?.post_title),
          content: default_lang?.content?.length > 50 ? strip(default_lang?.content?.substring(0, 50)) : strip(default_lang?.content),
          no_of_questions: paragraph?.questions_count ?? 0,
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

  const deleteBulkMutation = DeleteBulkParagraph(quiz_id);
  const handleBulkDelete = () => {
    if (confirm(__("Do you really want to delete these paragraphs?", "acadlix"))) {
      deleteBulkMutation?.mutate(
        {
          paragraph_ids: methods?.watch("paragraph_ids"),
        },
        {
          onSettled: () => {
            methods?.setValue("action", "", { shouldDirty: true });
            methods?.setValue("paragraph_ids", [], { shouldDirty: true });
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
      if (methods?.watch("paragraph_ids")?.length > 0) {
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
        <Grid size={{ xs: 12, lg: 12 }}>
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
            {__("Back", "acadlix")}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
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
                    {__("Paragraph Overview", "acadlix")}
                  </Typography>
                  <Button
                    variant="contained"
                    LinkComponent={Link}
                    to={`/${quiz_id}/paragraph/create`}
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
                    methods?.setValue("paragraph_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("paragraph_ids")}
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

export default Paragraph;
