import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
    Link,
    ListItem,
    List,
    IconButton,
    TextField
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { Link as RouterLink } from 'react-router-dom';
import { FaDownload, TiArrowLeftThick } from '../../../helpers/icons';
import { useParams } from 'react-router-dom';
import { GetEvaluationAssignment, PostEvaluateAssignment } from '../../../requests/admin/AdminAssignmentRequest';
import Loader from '../../../components/Loader';
import { useForm } from 'react-hook-form';
import CustomLatex from '../../../modules/latex/CustomLatex';
import CustomTextField from '../../../components/CustomTextField';
import { getCurrentDate } from '../../../helpers/util';

const EvaluationAssignment = () => {
    const methods = useForm(
        {
            defaultValues: {
                assignment: {},
                user: {},
                assignment_meta_value: {},
            }
        }
    );

    const { assignment_id, course_statistics_id } = useParams();

    const { isFetching, data, refetch } = GetEvaluationAssignment(
        assignment_id,
        course_statistics_id
    );

    React.useMemo(() => {
        if (data?.data?.assignment) {
            methods.setValue('assignment', data?.data?.assignment);
        }
        if (data?.data?.course_statistic) {
            methods.setValue('user', data?.data?.course_statistic?.user);
            methods.setValue('assignment_meta_value', data?.data?.course_statistic?.meta_value);
        }
    }, [data]);


    const assignment_meta_value = methods?.watch('assignment')?.rendered_metas;
    const current_meta_index = methods?.watch('assignment_meta_value')?.submissions?.findIndex((s) => s?.attempt === methods?.watch('assignment_meta_value')?.current_attempt);
    const current_meta_value = methods?.watch('assignment_meta_value')?.submissions?.find((s) => s?.attempt === methods?.watch('assignment_meta_value')?.current_attempt);

    const evaluateMutation = PostEvaluateAssignment(assignment_id, course_statistics_id);
    const onSubmit = (data) => {
        const meta_value = {
            ...methods?.watch('assignment_meta_value'),
            submissions: methods?.watch('assignment_meta_value')?.submissions?.map((s, s_index) => {
                if (s_index === current_meta_index) {
                    return {
                        ...s,
                        evaluated_by: acadlixOptions?.user_id,
                        evaluated_at: getCurrentDate(),
                        evaluation_status: "evaluated",
                    }
                }
                return s;
            })
        }
        evaluateMutation?.mutate(
            {
                meta_value: meta_value,
            },
            {
                onSuccess: (data) => {
                    if(data?.data?.success) {
                        if (data?.data?.course_statistic) {
                            methods.setValue('assignment_meta_value', data?.data?.course_statistic?.meta_value);
                        }
                    }
                }
            }
        )
    }

    if (isFetching) {
        return <Loader />;
    }

    return (
        <Box>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid
                    container
                    rowSpacing={3}
                    spacing={4}
                    sx={{
                        padding: 4,
                    }}>
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
                                LinkComponent={RouterLink}
                                to={`/view/${assignment_id}`}
                            >
                                {__("Back", "acadlix")}
                            </Button>
                            <Typography variant="h6">
                                {__("Evaluation", "acadlix")}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Card>
                            <CardContent>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 600,
                                            }}>
                                                {methods?.watch('assignment')?.post_title}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                            <Typography variant="body1" component="div" sx={{
                                                fontSize: 16,
                                            }}>
                                                <CustomLatex>
                                                    {methods?.watch('assignment')?.rendered_post_content}
                                                </CustomLatex>
                                            </Typography>
                                        </Grid>

                                        {
                                            assignment_meta_value?.attachments?.length > 0 && (
                                                <>
                                                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                        <Typography variant="h6" sx={{
                                                            fontWeight: 600
                                                        }}>
                                                            {__("Attachments", "acadlix")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                        <Grid container spacing={2}>
                                                            {assignment_meta_value?.attachments?.map((a, index) => {
                                                                return (
                                                                    <Grid
                                                                        size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                                                                        key={index}
                                                                    >
                                                                        <Box>
                                                                            <Typography variant="body1" sx={{
                                                                                fontWeight: 600,
                                                                            }}>
                                                                                {a?.title}
                                                                            </Typography>
                                                                            {
                                                                                a?.type === "upload" ? (
                                                                                    <Box sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        gap: 2,
                                                                                    }}>
                                                                                        <Link
                                                                                            href={a?.file_url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            sx={{
                                                                                                textDecoration: "none",
                                                                                            }}
                                                                                        >
                                                                                            {a?.filename}
                                                                                        </Link>
                                                                                        <Link
                                                                                            href={a?.file_url}
                                                                                            download
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            sx={{
                                                                                                textDecoration: "none",
                                                                                            }}
                                                                                        >
                                                                                            <FaDownload />
                                                                                        </Link>
                                                                                    </Box>
                                                                                ) : (
                                                                                    <Link
                                                                                        href={a?.link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        sx={{
                                                                                            textDecoration: "none",
                                                                                        }}
                                                                                    >
                                                                                        {a?.link}
                                                                                    </Link>
                                                                                )
                                                                            }
                                                                        </Box>
                                                                    </Grid>
                                                                )
                                                            })}
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )
                                        }

                                        <>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 600
                                                }}>
                                                    {__("Assignment Submission", "acadlix")}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {__("Response", "acadlix")}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <Typography variant="body1" component="div" sx={{
                                                    fontSize: 16,
                                                }}>
                                                    <CustomLatex>
                                                        {current_meta_value?.answer_text}
                                                    </CustomLatex>
                                                </Typography>
                                            </Grid>
                                            {
                                                current_meta_value?.answer_files?.length > 0 && (
                                                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {__("Uploads", "acadlix")}
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                {
                                                                    current_meta_value?.answer_files?.map((f, i) => (
                                                                        <Grid
                                                                            size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                                                                            key={i}
                                                                        >

                                                                            <Box sx={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: 2,
                                                                            }}>
                                                                                <Link
                                                                                    href={f?.file_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    sx={{
                                                                                        textDecoration: "none",
                                                                                    }}
                                                                                >
                                                                                    {f?.file_name}
                                                                                </Link>
                                                                                <Link
                                                                                    href={f?.file_url}
                                                                                    download
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    sx={{
                                                                                        textDecoration: "none",
                                                                                    }}
                                                                                >
                                                                                    <FaDownload />
                                                                                </Link>
                                                                            </Box>
                                                                        </Grid>
                                                                    ))
                                                                }
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                )
                                            }
                                        </>
                                        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3, xl: 3 }}>
                                            <CustomTextField
                                                fullWidth
                                                size="small"
                                                label={__("Points", "acadlix")}
                                                variant="outlined"
                                                type="number"
                                                value={methods?.watch(`assignment_meta_value.submissions.${current_meta_index}.points`)}
                                                helperText={__(`Max: ${assignment_meta_value?.max_points} point(s)`, "acadlix")}
                                                onChange={(e) => {
                                                    const value = Number(e?.target?.value);
                                                    if(value > Number(assignment_meta_value?.max_points)) {
                                                        return;
                                                    }
                                                    methods?.setValue(
                                                        `assignment_meta_value.submissions.${current_meta_index}.points`,
                                                        value,
                                                        {
                                                            shouldDirty: true,
                                                        }
                                                    )
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8, md: 8, lg: 9, xl: 9 }}>
                                            <CustomTextField
                                                fullWidth
                                                multiline
                                                label={__("Feedback", "acadlix")}
                                                rows={4}
                                                value={methods?.watch(`assignment_meta_value.submissions.${current_meta_index}.feedback`)}
                                                onChange={(e) => {
                                                    const value = e?.target?.value;
                                                    methods?.setValue(
                                                        `assignment_meta_value.submissions.${current_meta_index}.feedback`,
                                                        value,
                                                        {
                                                            shouldDirty: true,
                                                        }
                                                    )
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Button
                            variant="contained"
                            size="medium"
                            type="submit"
                            loading={evaluateMutation?.isPending}
                        >
                            {__("Save Change", "acadlix")}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default EvaluationAssignment;
