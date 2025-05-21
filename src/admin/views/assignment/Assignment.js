import React from 'react'
import { useForm } from 'react-hook-form';
import { FaEdit, FaSearch, FaTrash, IoMdRefresh } from '../../../helpers/icons';
import { __ } from "@wordpress/i18n";
import { hasCapability } from "../../../helpers/util";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DeleteAssignmentById, DeleteBulkAssignment, GetAssignments } from "../../../requests/admin/AdminAssignmentRequest";
import { DataGrid } from '@mui/x-data-grid';
import CustomTextField from '../../../components/CustomTextField';

const Assignment = () => {
    const methods = useForm({
        defaultValues: {
            search: "",
            rows: [],
            assignment_ids: [],
            action: "",
        },
    });

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    const deleteMutation = DeleteAssignmentById();

    const deleteAssignmentById = (id) => {
        if (confirm(__("Do you really want to delete this assignment?", "acadlix"))) {
            deleteMutation?.mutate(id);
        }
    };

    const columns = [
        { field: "id", headerName: __("ID", "acadlix") },
        { field: "title", headerName: __("Title", "acadlix"), flex: 2, minWidth: 130 },
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
                            hasCapability("acadlix_edit_assignment") &&
                            <Tooltip title={__("Edit Assignment", "acadlix")} arrow>
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
                            hasCapability("acadlix_delete_assignment") &&
                            <Tooltip title={__("Delete Assignment", "acadlix")} arrow>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    color="error"
                                    onClick={deleteAssignmentById.bind(this, params?.id)}
                                >
                                    <FaTrash />
                                </IconButton>
                            </Tooltip>
                        }
                    </>
                )
            }
        }
    ]

    const { isFetching, data, refetch } = GetAssignments(
        paginationModel?.page,
        paginationModel?.pageSize,
        methods?.watch("search")
    );

    React.useMemo(() => {
        if (Array.isArray(data?.data?.assignments)) {
            const newRows = data?.data?.assignments?.map((assignment) => {
                return {
                    id: assignment?.ID,
                    title: assignment?.post_title,
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

    const deleteBulkMutation = DeleteBulkAssignment();
    const handleBulkDelete = () => {
        if (
            confirm(
                __("Do you really want to delete these assignment(s)?", "acadlix")
            )
        ) {
            deleteBulkMutation?.mutate(
                {
                    assignment_ids: methods?.watch("assignment_ids"),
                },
                {
                    onSettled: () => {
                        refetch();
                        methods?.reset();
                    },
                }
            );
        }
    };

    const handleActionChange = (e) => {
        methods?.setValue("action", e?.target?.value, { shouldDirty: true });
    };

    const handleBulkAction = () => {
        if (!methods?.watch("action")) {
            methods?.setError("action", {
                type: "custom",
                message: __("Action required", "acadlix"),
            });
            return;
        }

        methods?.clearErrors("action");
        if (methods?.watch("assignment_ids")?.length > 0) {
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
    };

    const handleSearch = (e) => {
        methods?.setValue("search", e?.target?.value, { shouldDirty: true });
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
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {__("Assignment Overview", "acadlix")}
                                    </Typography>
                                    {
                                        hasCapability("acadlix_add_assignment") &&
                                        <Button
                                            variant="contained"
                                            LinkComponent={Link}
                                            to="/create"
                                        >
                                            {__("Add Assignment", "acadlix")}
                                        </Button>
                                    }
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
                        />
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
                                    justifyContent: hasCapability("acadlix_bulk_action_assignment")
                                        ? "space-between"
                                        : "flex-end"
                                }}
                            >
                                {
                                    hasCapability("acadlix_bulk_action_assignment") &&
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
                                                    hasCapability("acadlix_bulk_delete_assignment") &&
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
                                    onPaginationModelChange={setPaginationModel}
                                    paginationMode="server"
                                    pageSizeOptions={[10, 25, 50]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    disableColumnMenu
                                    onRowSelectionModelChange={(data) => {
                                        methods?.setValue("assignment_ids", data, {
                                            shouldDirty: true,
                                        });
                                    }}
                                    rowSelectionModel={methods?.watch("assignment_ids")}
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
    )
}

export default Assignment