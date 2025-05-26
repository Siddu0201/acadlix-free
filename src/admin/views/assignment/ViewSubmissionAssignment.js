import React from 'react'
import { useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid2';
import { Box, Button, Card, CardContent, CardHeader, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { __ } from '@wordpress/i18n';
import { Link, useParams } from 'react-router-dom';
import { GetAssignmentSubmissionsById } from '../../../requests/admin/AdminAssignmentRequest';
import { EvaluationIcon, IoMdRefresh, TiArrowLeftThick } from '../../../helpers/icons';
import Loader from '../../../components/Loader';

const ViewSubmissionAssignment = () => {
    const methods = useForm({
        defaultValues: {
            search: "",
            rows: [],
            course_filter: [],
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
            case "submitted":
                return <Chip label="Submitted" color="success" />;
            case "draft":
                return <Chip label="Draft" color="grey" />;
            case "evaluated":
                return <Chip label="Evaluated" color="success" />;
            default:
                return <Chip label="Not Started" color="error" />;
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
                    </>
                );
            },
        },
    ];

    const { isFetching, data, refetch } = GetAssignmentSubmissionsById(
        assignment_id
    );

    React.useMemo(() => {
        if (Array.isArray(data?.data?.submissions)) {
            let newRows = [];
            data?.data?.submissions?.forEach((submission) => {
                submission?.course?.sections?.forEach((section) => {
                    section?.contents?.forEach((content) => {
                        if (content?.contentable?.type === "assignment") {
                            const attempt = content?.course_statistics?.find((stat) => stat?.user_id === submission?.order?.user?.ID);
                            const attempt_submission = attempt ? attempt?.meta_value?.submissions?.find((sub) => sub?.attempt === attempt?.meta_value?.current_attempt) : null;
                            console.log(attempt_submission);
                            if (attempt_submission) {
                                newRows.push({
                                    id: attempt?.id,
                                    course: submission?.course?.post_title,
                                    student: `${submission?.order?.user?.display_name} (${submission?.order?.user?.user_email})`,
                                    student_status: attempt_submission?.student_status,
                                    evaluation_status: attempt_submission?.evaluation_status,
                                    started_on: attempt?.meta_value?.first_started_at ? attempt?.meta_value?.first_started_at : "-",
                                });
                            }
                        }
                    });
                });
            });
methods?.setValue("rows", newRows, { shouldDirty: true });
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
    methods?.setValue("search", e?.target?.value, { shouldDirty: true });
};

if (isFetching) return <Loader />;

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
                                    {data?.data?.assignment?.post_title}
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