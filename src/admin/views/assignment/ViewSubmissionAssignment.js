import React from 'react'
import { useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid2';
import { Box, Button, Card, CardContent, CardHeader, Chip, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { __ } from '@wordpress/i18n';
import { Link, useParams } from 'react-router-dom';
import { DeleteEvaluationAssignment, GetAssignmentById, GetAssignmentSubmissionsById } from '../../../requests/admin/AdminAssignmentRequest';
import { EvaluationIcon, FaSearch, FaTrash, IoMdRefresh, TiArrowLeftThick } from '../../../helpers/icons';
import Loader from '../../../components/Loader';
import { getFormatDate } from '../../../helpers/util';
import CustomTextField from '../../../components/CustomTextField';

const ViewSubmissionAssignment = () => {
    const methods = useForm({
        defaultValues: {
            search: "",
            rows: [],
            course_id: "",
            admin_status: "",
            user_status: "",
            courses: [],
            assignment_ids: [],
            action: "",
        },
    });

    const { assignment_id } = useParams();

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 20,
        page: 0,
    });

    const getStatus = (status = '') => {
        switch (status) {
            case "pending":
                return <Chip label="Pending" color="warning" />;
            case "pending_review":
                return <Chip label="Pending Review" color="warning" />;
            case "submitted":
                return <Chip label="Submitted" color="success" />;
            case "draft":
                return <Chip label="Draft" color="grey" />;
            case "evaluated":
                return <Chip label="Evaluated" color="success" />;
            default:
                return <Chip label="Pending" color="warning" />;
        }
    }

    const deleteEvaluateMutation = DeleteEvaluationAssignment(assignment_id);
    const deleteEvaluatedAssignment = (course_statistic_id) => {
        if (!course_statistic_id) return;
        if (confirm(__('Are you sure you want to delete this evaluated assignment?', 'acadlix'))) {
            deleteEvaluateMutation.mutate(course_statistic_id);
        }
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 2, minWidth: 130 },
        { field: "course", headerName: "Course", flex: 2, minWidth: 130 },
        { field: "student", headerName: "Student", flex: 2, minWidth: 130 },
        {
            field: "student_status",
            headerName: "Student Status",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return getStatus(params?.value);
            },
        },
        {
            field: "evaluation_status",
            headerName: "Evaluation Status",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return getStatus(params?.value);
            },
        },
        { field: "started_on", headerName: "Started On", flex: 2, minWidth: 130 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params?.row?.student_status == "submitted" &&
                            <Tooltip title={__("Evaluate", "acadlix")} arrow>
                                <IconButton
                                    aria-label="evaluate"
                                    size="small"
                                    color="primary"
                                    LinkComponent={Link}
                                    to={`/view/${assignment_id}/evaluate/${params?.row?.id}`}
                                >
                                    <EvaluationIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip title={__("Delete", "acadlix")} arrow>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                color="error"
                                onClick={deleteEvaluatedAssignment.bind(this, params?.row?.id)}
                            >
                                <FaTrash />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    const getAssignmentById = GetAssignmentById(assignment_id);

    const { isFetching, data, refetch } = GetAssignmentSubmissionsById(
        assignment_id,
        paginationModel?.page,
        paginationModel?.pageSize,
        methods?.watch("search"),
        methods?.watch("course_id"),
        methods?.watch("user_status"),
        methods?.watch("admin_status")
    );

    React.useMemo(() => {
        if (Array.isArray(data?.data?.course_statistics)) {
            let newRows = [];
            data?.data?.course_statistics?.forEach((course_statistic) => {
                newRows.push({
                    id: course_statistic?.id,
                    course: course_statistic?.order_item?.course?.post_title,
                    student: `${course_statistic?.user?.display_name} (${course_statistic?.user?.user_email})`,
                    student_status: course_statistic?.assignment_user_stat?.user_status,
                    evaluation_status: course_statistic?.assignment_user_stat?.admin_status,
                    started_on: course_statistic?.assignment_user_stat?.first_started_at ?
                        getFormatDate(course_statistic?.assignment_user_stat?.first_started_at) : "-",
                });
            });
            methods?.setValue("rows", newRows, { shouldDirty: true });
        }
        if (data?.data?.courses) {
            methods?.setValue("courses", data?.data?.courses, { shouldDirty: true });
        }
    }, [data?.data]);

    const rowCountRef = React.useRef(data?.data?.total || 0);

    const rowCount = React.useMemo(() => {
        if (data?.data?.total !== undefined) {
            rowCountRef.current = data?.data?.total;
        }
        return rowCountRef.current;
    }, [data?.data?.total]);

    const handleSearch = (e) => {
        methods?.setValue("search", e?.target?.value, { shouldDirty: true });
    };

    if (getAssignmentById?.isFetching) return <Loader />;

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
                <Grid size={{ xs: 12, sm: 12 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
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
                    </Box>
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
                                        {getAssignmentById?.data?.data?.assignment?.post_title}
                                    </Typography>
                                    <Tooltip title={__("Refresh", "acadlix")} arrow>
                                        <Button variant="contained" onClick={refetch} size="large">
                                            <IoMdRefresh />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Box
                                sx={{
                                    paddingBottom: 2,
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "start",
                                    justifyContent: "space-between",
                                    overflowX: "auto",
                                }}
                            >
                                <Box sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                }}>
                                    <FormControl
                                        sx={{ minWidth: 180 }}
                                        size="small"
                                    >
                                        <InputLabel id="demo-simple-select-label">
                                            {__("Course Filter", "acadlix")}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={methods?.watch("course_id")}
                                            label={__("Course Filter", "acadlix")}
                                            onChange={(e) => {
                                                methods?.setValue("course_id", e?.target?.value, { shouldDirty: true });
                                            }}
                                        >
                                            <MenuItem value="">{__("All Course", "acadlix")}</MenuItem>
                                            {
                                                methods?.watch("courses")?.map((course) => (
                                                    <MenuItem key={course?.ID} value={course?.ID}>
                                                        {course?.post_title}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        sx={{ minWidth: 180 }}
                                        size="small"
                                    >
                                        <InputLabel id="demo-simple-select-label">
                                            {__("User Status", "acadlix")}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={methods?.watch("user_status")}
                                            label={__("User Status", "acadlix")}
                                            onChange={(e) => {
                                                methods?.setValue("user_status", e?.target?.value, { shouldDirty: true });
                                            }}
                                        >
                                            <MenuItem value="">{__("All", "acadlix")}</MenuItem>
                                            <MenuItem value="pending">{__("Pending", "acadlix")}</MenuItem>
                                            <MenuItem value="draft">{__("Draft", "acadlix")}</MenuItem>
                                            <MenuItem value="submitted">{__("Submitted", "acadlix")}</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        sx={{ minWidth: 180 }}
                                        size="small"
                                    >
                                        <InputLabel id="demo-simple-select-label">
                                            {__("Evaluation Status", "acadlix")}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={methods?.watch("admin_status")}
                                            label={__("Evaluation Status", "acadlix")}
                                            onChange={(e) => {
                                                methods?.setValue("admin_status", e?.target?.value, { shouldDirty: true });
                                            }}
                                        >
                                            <MenuItem value="">{__("All", "acadlix")}</MenuItem>
                                            <MenuItem value="pending_review">{__("Pending Review", "acadlix")}</MenuItem>
                                            <MenuItem value="evaluated">{__("Evaluated", "acadlix")}</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            methods?.setValue("course_id", "");
                                            methods?.setValue("user_status", "");
                                            methods?.setValue("admin_status", "");
                                            methods?.setValue("search", "");
                                        }}
                                        size="medium"
                                        color='error'
                                    >
                                        {__("Reset", "acadlix")}
                                    </Button>
                                </Box>
                                <Box>
                                    <CustomTextField
                                        fullWidth
                                        size="small"
                                        label={__("Search", "acadlix")}
                                        name="search"
                                        value={methods?.watch("search") ?? ""}
                                        onChange={handleSearch}
                                        helperText={__("Search by course,user", "acadlix")}
                                        type="search"
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
                                    pageSizeOptions={[10, 20, 50, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    disableColumnMenu
                                    onRowSelectionModelChange={(data) => {
                                        methods?.setValue("assignment_ids", data, {
                                            shouldDirty: true,
                                        });
                                    }}
                                    rowSelectionModel={methods?.watch("assignment_ids")}
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

export default ViewSubmissionAssignment