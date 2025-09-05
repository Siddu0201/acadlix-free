import { 
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CustomTextField from "@acadlix/components/CustomTextField";
import { 
    DeleteCategoryById,
    GetCategories,
    PostCreateCategory,
    UpdateCategoryById
} from "@acadlix/requests/admin/AdminCategoryRequest";
import toast from 'react-hot-toast';
import { 
    DefaultLanguageById,
    GetLanguages,
    PostCreateLanguage,
    UpdateLanguageById
} from "@acadlix/requests/admin/AdminLanguageRequest";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";
import CustomTypography from '@acadlix/components/CustomTypography';
import { DeleteSubjectById, GetSubjects, PostCreateSubject, UpdateSubjectById } from '@acadlix/requests/admin/AdminSubjectRequest';

const QuizSettings = (props) => {
    const methods = useForm({
        defaultValues: {
            categories: [],
            category_id: null,
            category_name: "",
            languages: [],
            language_id: null,
            language_name: "",
            subjects: [],
            subject_id: null,
            subject_name: "",
        }
    });

    const getCategories = GetCategories();
    const getLanguages = GetLanguages();
    const getSubjects = GetSubjects();

    useEffect(() => {
        if (getCategories?.data?.data?.categories?.length > 0) {
            methods.setValue("categories", getCategories?.data?.data?.categories);
        }

        if (getLanguages?.data?.data?.languages?.length > 0) {
            methods.setValue("languages", getLanguages?.data?.data?.languages);
        }

        if (getSubjects?.data?.data?.subjects?.length > 0) {
            methods.setValue("subjects", getSubjects?.data?.data?.subjects);
        }
    }, [getCategories?.data?.data, getLanguages?.data?.data, getSubjects?.data?.data]);

    if (getCategories?.isFetching || getLanguages?.isFetching || getSubjects?.isFetching) {
        return (
            <Box>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Card>
            <CardContent>
                <Box>
                    <CategorySettings methods={methods} />
                    {/* <LanguageSettings methods={methods} /> */}
                    <SubjectSettings methods={methods} />
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={props?.isPending}
                >
                    {__("Save", "acadlix")}
                </Button>
            </CardActions>
        </Card>
    )
}

const CategorySettings = ({ methods }) => {

    const addCategoryMutation = PostCreateCategory();
    const updateCategoryMutation = UpdateCategoryById(methods?.watch("category_id"));
    const deleteCategoryMutation = DeleteCategoryById(methods?.watch("category_id"));

    const handleAddCategory = () => {
        if (methods?.watch("category_name") === "") {
            toast.error(__("Please enter category name.", "acadlix"));
            return;
        }

        if (methods?.watch("categories")?.find((c) => c?.name?.toLowerCase() === methods?.watch("category_name")?.toLowerCase())) {
            toast.error(__("Category name is already exist.", "acadlix"));
            return;
        }

        addCategoryMutation.mutate({
            category_name: methods?.watch("category_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("category_name", "");
                methods?.setValue("categories", data?.data?.categories);
                toast.success(__("Category added successfully.", "acadlix"));
            },
        })
    }

    const handleUpdateCategory = () => {
        if (methods?.watch("category_name") === "") {
            toast.error(__("Please enter category name.", "acadlix"));
            return;
        }

        if (methods?.watch("categories")?.filter(c => c?.term_id !== methods?.watch("category_id"))?.find((c) => c?.name?.toLowerCase() === methods?.watch("category_name")?.toLowerCase())) {
            toast.error(__("Category name is already exist.", "acadlix"));
            return;
        }

        if (methods?.watch("category_id") === null) {
            toast.error(__("Please select category.", "acadlix"));
            return;
        }

        updateCategoryMutation?.mutate({
            category_name: methods?.watch("category_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("category_name", "");
                methods.setValue("category_id", null);
                methods?.setValue("categories", data?.data?.categories);
                toast.success(__("Category updated successfully.", "acadlix"));
            },
        })
    }

    const handleDeleteCategory = () => {
        if (methods?.watch("category_id") === null) {
            toast.error(__("Please select category.", "acadlix"));
            return;
        }

        if (confirm(__("Do you really want to delete this category?", "acadlix"))) {
            deleteCategoryMutation?.mutate({}, {
                onSuccess: (data) => {
                    methods.setValue("category_name", "");
                    methods.setValue("category_id", null);
                    methods?.setValue("categories", data?.data?.categories);
                    toast.success(__("Category deleted successfully.", "acadlix"));
                },
            });
        }
    }
    return (
        <React.Fragment>
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h6">{__("Quiz Categories", "acadlix")}</Typography>
                <Divider />
            </Box>
            <Grid container spacing={{
                xs: 2,
                sm: 4,
            }}>
                <Grid size={{ xs: 12, sm: 12, lg: 7 }}>
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 4,
                        }}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <CustomTypography>
                                {__("Select Category", "acadlix")}
                            </CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Autocomplete
                                size="small"
                                value={
                                    methods?.watch("category_id") !== null
                                        ? methods?.watch("categories")?.find(
                                            (p) =>
                                                p?.term_id ===
                                                Number(methods?.watch("category_id"))
                                        )
                                        : null
                                }
                                options={methods?.watch("categories")?.length > 0 ? methods?.watch("categories") : []}
                                getOptionLabel={(option) =>
                                    `${option?.name} ${option?.default ? __(" (Default)", "acadlix") : ""}` || ""
                                }
                                isOptionEqualToValue={(option, value) => {
                                    return option?.term_id === value?.term_id;
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "category",
                                        }}
                                        label={__("Select Category", "acadlix")}
                                    />
                                )}
                                onChange={(_, newValue) => {
                                    methods?.setValue(
                                        "category_id",
                                        newValue?.term_id ?? null,
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                    methods?.setValue(
                                        "category_name",
                                        newValue?.name ?? "",
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                }}

                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <CustomTypography>
                                {methods?.watch("category_id") === null
                                    ? __("Add Category", "acadlix")
                                    : methods?.watch("categories")?.find(
                                        (c) => c?.term_id === methods?.watch("category_id")
                                    )?.default
                                        ? __("Edit Category", "acadlix")
                                        : __("Edit/Delete Category", "acadlix")
                                }
                            </CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Box sx={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <CustomTextField
                                    fullWidth
                                    name="category_name"
                                    size="small"
                                    label={__("Enter category name", "acadlix") + " *"}
                                    value={methods?.watch("category_name") ?? ""}
                                    onChange={(e) => {
                                        methods?.setValue("category_name", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                                {
                                    methods?.watch("category_id") === null
                                        ? (
                                            hasCapability("acadlix_add_quiz_category") &&
                                            <Button
                                                loading={addCategoryMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddCategory}
                                            >{__("Add", "acadlix")}</Button>
                                        )
                                        :
                                        <>
                                            {
                                                hasCapability("acadlix_edit_quiz_category") &&
                                                <Button
                                                    loading={updateCategoryMutation?.isPending}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleUpdateCategory}
                                                >{__("Update", "acadlix")}</Button>
                                            }
                                            {!methods?.watch("categories")?.find(
                                                (c) => c?.term_id === methods?.watch("category_id")
                                            )?.default && (
                                                    hasCapability("acadlix_delete_quiz_category") &&
                                                    <Button
                                                        loading={deleteCategoryMutation?.isPending}
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleDeleteCategory}
                                                    >{__("Delete", "acadlix")}</Button>
                                                )
                                            }
                                        </>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const LanguageSettings = ({ methods }) => {

    const addLanguageMutation = PostCreateLanguage();
    const updateLanguageMutation = UpdateLanguageById(methods?.watch("language_id"));
    const setDefaultLanguageMutation = DefaultLanguageById(methods?.watch("language_id"));

    const handleAddLanguage = () => {
        if (methods?.watch("language_name") === "") {
            toast.error(__('Please enter language name.', 'acadlix'));
            return;
        }

        if (methods?.watch("languages")?.find((c) => c?.name?.toLowerCase() === methods?.watch("language_name")?.toLowerCase())) {
            toast.error(__('Language name is already exist.', 'acadlix'));
            return;
        }

        addLanguageMutation?.mutate({
            language_name: methods?.watch("language_name")
        }, {
            onSuccess: (data) => {
                methods?.setValue("language_name", "");
                methods?.setValue("languages", data?.data?.languages);
                toast.success(__('Langauge added successfully.', 'acadlix'));
            }
        })
    }

    const handleUpdateLanguage = () => {
        if (methods?.watch("language_name") === "") {
            toast.error(__('Please enter language name.', 'acadlix'));
            return;
        }

        if (methods?.watch("languages")?.filter(l => l?.term_id !== methods?.watch("language_id"))?.find((l) => l?.name?.toLowerCase() === methods?.watch("language_name")?.toLowerCase())) {
            toast.error(__('Language name is already exist.', 'acadlix'));
            return;
        }

        if (methods?.watch("language_id") === null) {
            toast.error(__('Please select language.', 'acadlix'));
            return;
        }

        updateLanguageMutation?.mutate({
            language_name: methods?.watch("language_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("language_name", "");
                methods.setValue("language_id", null);
                methods?.setValue("languages", data?.data?.languages);
                toast.success(__('Language updated successfully.', 'acadlix'));
            }
        })
    }

    const handleDefaultLanguage = () => {
        if (methods?.watch("language_id") === null) {
            toast.error(__('Please select language.', 'acadlix'));
            return;
        }

        if (confirm(__('Are you sure you want to switch the default language?', 'acadlix'))) {
            setDefaultLanguageMutation?.mutate({}, {
                onSuccess: (data) => {
                    methods.setValue("language_name", "");
                    methods.setValue("language_id", null);
                    methods?.setValue("languages", data?.data?.languages);
                    toast.success(__('Language set to default.', 'acadlix'));
                }
            });
        }
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h6">{__('Quiz Languages', 'acadlix')}</Typography>
                <Divider />
            </Box>
            <Grid container spacing={{
                xs: 2,
                sm: 4,
            }}>
                <Grid size={{ xs: 12, sm: 12, lg: 7 }}>
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 4,
                        }}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: {
                                        xs: 500,
                                        sm: 500,
                                        md: 500,
                                    },
                                }}
                            >
                                {__('Select Language', 'acadlix')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Autocomplete
                                size="small"
                                value={
                                    methods?.watch("language_id") !== null
                                        ? methods?.watch("languages")?.find(
                                            (p) =>
                                                p?.term_id ===
                                                Number(methods?.watch("language_id"))
                                        )
                                        : null
                                }
                                options={methods?.watch("languages")?.length > 0 ? methods?.watch("languages") : []}
                                getOptionLabel={(option) =>
                                    `${option?.name} ${option?.default ? __(" (Default)", 'acadlix') : ""}` || ""
                                }
                                isOptionEqualToValue={(option, value) => {
                                    return option?.term_id === value?.term_id;
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "language",
                                        }}
                                        label={__('Select Language', 'acadlix')}
                                    />
                                )}
                                onChange={(_, newValue) => {
                                    methods?.setValue(
                                        "language_id",
                                        newValue?.term_id ?? null,
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                    methods?.setValue(
                                        "language_name",
                                        newValue?.name ?? "",
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                }}

                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: {
                                        xs: 500,
                                        sm: 500,
                                        md: 500,
                                    },
                                }}
                            >
                                {methods?.watch("language_id") === null
                                    ? __("Add Language", 'acadlix')
                                    : __("Edit Language", 'acadlix')
                                }
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Box sx={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <CustomTextField
                                    fullWidth
                                    name="language_name"
                                    size="small"
                                    label={__("Enter language name", 'acadlix') + " *"}
                                    value={methods?.watch("language_name") ?? ""}
                                    onChange={(e) => {
                                        methods?.setValue("language_name", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                                {
                                    methods?.watch("language_id") === null
                                        ? (
                                            hasCapability("acadlix_add_quiz_language") &&
                                            <Button
                                                loading={addLanguageMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddLanguage}
                                            >{__("Add", 'acadlix')}</Button>
                                        )
                                        :
                                        <>
                                            {
                                                hasCapability("acadlix_edit_quiz_language") &&
                                                <Button
                                                    loading={updateLanguageMutation?.isPending}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleUpdateLanguage}
                                                >{__("Update", 'acadlix')}</Button>
                                            }
                                            {
                                                !methods?.watch("languages")?.find(l => l?.term_id === methods?.watch("language_id"))?.default &&
                                                hasCapability("acadlix_default_quiz_language") &&
                                                <Button
                                                    loading={setDefaultLanguageMutation?.isPending}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleDefaultLanguage}
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        minWidth: "90px",
                                                    }}
                                                >{__("Set Default", 'acadlix')}</Button>
                                            }
                                        </>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const SubjectSettings = ({ methods }) => {

    const addSubjectMutation = PostCreateSubject();
    const updateSubjectMutation = UpdateSubjectById(methods?.watch("subject_id"));
    const deleteSubjectMutation = DeleteSubjectById(methods?.watch("subject_id"));

    const handleAddSubject = () => {
        if (methods?.watch("subject_name") === "") {
            toast.error(__("Please enter subject name.", "acadlix"));
            return;
        }

        if (methods?.watch("subjects")?.find((c) => c?.name?.toLowerCase() === methods?.watch("subject_name")?.toLowerCase())) {
            toast.error(__("Subject name is already exist.", "acadlix"));
            return;
        }

        addSubjectMutation.mutate({
            subject_name: methods?.watch("subject_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("subject_name", "");
                methods?.setValue("subjects", data?.data?.subjects);
                toast.success(__("Category added successfully.", "acadlix"));
            },
        })
    }

    const handleUpdateSubject = () => {
        if (methods?.watch("subject_name") === "") {
            toast.error(__("Please enter subject name.", "acadlix"));
            return;
        }

        if (methods?.watch("subjects")?.filter(c => c?.term_id !== methods?.watch("subject_id"))?.find((c) => c?.name?.toLowerCase() === methods?.watch("subject_name")?.toLowerCase())) {
            toast.error(__("Subject name is already exist.", "acadlix"));
            return;
        }

        if (methods?.watch("subject_id") === null) {
            toast.error(__("Please select subject.", "acadlix"));
            return;
        }

        updateSubjectMutation?.mutate({
            subject_name: methods?.watch("subject_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("subject_name", "");
                methods.setValue("subject_id", null);
                methods?.setValue("subjects", data?.data?.subjects);
                toast.success(__("Subject updated successfully.", "acadlix"));
            },
        })
    }

    const handleDeleteSubject = () => {
        if (methods?.watch("subject_id") === null) {
            toast.error(__("Please select subject.", "acadlix"));
            return;
        }

        if (confirm(__("Do you really want to delete this subject?", "acadlix"))) {
            deleteSubjectMutation?.mutate({}, {
                onSuccess: (data) => {
                    methods.setValue("subject_name", "");
                    methods.setValue("subject_id", null);
                    methods?.setValue("subjects", data?.data?.subjects);
                    toast.success(__("Subject deleted successfully.", "acadlix"));
                },
            });
        }
    }
    return (
        <React.Fragment>
            <Box
                sx={{
                    marginY: 2,
                }}
            >
                <Typography variant="h6">{__("Question Subjects", "acadlix")}</Typography>
                <Divider />
            </Box>
            <Grid container spacing={{
                xs: 2,
                sm: 4,
            }}>
                <Grid size={{ xs: 12, sm: 12, lg: 7 }}>
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 4,
                        }}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <CustomTypography>
                                {__("Select Subject", "acadlix")}
                            </CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Autocomplete
                                size="small"
                                value={
                                    methods?.watch("subject_id") !== null
                                        ? methods?.watch("subjects")?.find(
                                            (p) =>
                                                p?.id ===
                                                Number(methods?.watch("subject_id"))
                                        )
                                        : null
                                }
                                options={methods?.watch("subjects")?.length > 0 ? methods?.watch("subjects") : []}
                                getOptionLabel={(option) =>
                                    `${option?.subject_name} ${option?.default ? __(" (Default)", "acadlix") : ""}` || ""
                                }
                                isOptionEqualToValue={(option, value) => {
                                    return option?.id === value?.id;
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "subject",
                                        }}
                                        label={__("Select Subject", "acadlix")}
                                    />
                                )}
                                onChange={(_, newValue) => {
                                    methods?.setValue(
                                        "subject_id",
                                        newValue?.id ?? null,
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                    methods?.setValue(
                                        "subject_name",
                                        newValue?.subject_name ?? "",
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                }}

                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <CustomTypography>
                                {methods?.watch("subject_id") === null
                                    ? __("Add Subject", "acadlix")
                                    : methods?.watch("subjects")?.find(
                                        (c) => c?.id === methods?.watch("subject_id")
                                    )?.default
                                        ? __("Edit Subject", "acadlix")
                                        : __("Edit/Delete Subject", "acadlix")
                                }
                            </CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Box sx={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <CustomTextField
                                    fullWidth
                                    name="subject_name"
                                    size="small"
                                    label={__("Enter subject name", "acadlix") + " *"}
                                    value={methods?.watch("subject_name") ?? ""}
                                    onChange={(e) => {
                                        methods?.setValue("subject_name", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                                {
                                    methods?.watch("subject_id") === null
                                        ? (
                                            hasCapability("acadlix_add_subject") &&
                                            <Button
                                                loading={addSubjectMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddSubject}
                                            >{__("Add", "acadlix")}</Button>
                                        )
                                        :
                                        <>
                                            {
                                                hasCapability("acadlix_edit_subject") &&
                                                <Button
                                                    loading={updateSubjectMutation?.isPending}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleUpdateSubject}
                                                >{__("Update", "acadlix")}</Button>
                                            }
                                            {!methods?.watch("subjects")?.find(
                                                (c) => c?.id === methods?.watch("subject_id")
                                            )?.default && (
                                                    hasCapability("acadlix_delete_subject") &&
                                                    <Button
                                                        loading={deleteSubjectMutation?.isPending}
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleDeleteSubject}
                                                    >{__("Delete", "acadlix")}</Button>
                                                )
                                            }
                                        </>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default QuizSettings
