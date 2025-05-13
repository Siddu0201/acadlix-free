import React from 'react'
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, IoMdRefresh } from '../../../helpers/icons';
import { __ } from "@wordpress/i18n";
import { hasCapability } from "../../../helpers/util";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DeleteAssignmentById, GetAssignments } from "../../../requests/admin/AdminAssignmentRequest";
import { DataGrid } from '@mui/x-data-grid';

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
        { field: "type", headerName: __("Type", "acadlix"), flex: 2, minWidth: 100 },
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
                    type: assignment?.rendered_metas?.type,
                    total_resources: assignment?.resource_count,
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