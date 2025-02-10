import { Autocomplete, Box, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CustomTextField from '../../../../components/CustomTextField';
import { DeleteCategoryById, GetCategories, PostCreateCategory, UpdateCategoryById } from '../../../../requests/admin/AdminCategoryRequest';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { DefaultLanguageById, GetLanguages, PostCreateLanguage, UpdateLanguageById } from '../../../../requests/admin/AdminLanguageRequest';

const QuizSettings = (props) => {
    const methods = useForm({
        defaultValues: {
            categories: [],
            category_id: null,
            category_name: "",
            languages: [],
            language_id: null,
            language_name: "",
        }
    });

    const getCategories = GetCategories();
    const getLanguages = GetLanguages();

    useEffect(() => {
        console.log(getCategories);
        if (getCategories?.data?.data?.categories?.length > 0) {
            methods.setValue("categories", getCategories?.data?.data?.categories);
        }

        if (getLanguages?.data?.data?.languages?.length > 0) {
            methods.setValue("languages", getLanguages?.data?.data?.languages);
        }
    }, [getCategories?.data?.data, getLanguages?.data?.data]);

    if (getCategories?.isFetching || getLanguages?.isFetching) {
        return (
            <Box sx={{ color: "black" }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ color: "black" }}>
            <CategorySettings methods={methods} />
            <LanguageSettings methods={methods} />
        </Box>
    )
}

const CategorySettings = ({ methods }) => {

    const addCategoryMutation = PostCreateCategory();
    const updateCategoryMutation = UpdateCategoryById(methods?.watch("category_id"));
    const deleteCategoryMutation = DeleteCategoryById(methods?.watch("category_id"));

    const handleAddCategory = () => {
        if (methods?.watch("category_name") === "") {
            toast.error("Please enter category name.");
            return;
        }

        if (methods?.watch("categories")?.find((c) => c?.name?.toLowerCase() === methods?.watch("category_name")?.toLowerCase())) {
            toast.error("Category name is already exist.");
            return;
        }

        addCategoryMutation.mutate({
            category_name: methods?.watch("category_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("category_name", "");
                methods?.setValue("categories", data?.data?.categories);
                toast.success("Category added successfully.");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
                console.error(error);
            }
        })
    }

    const handleUpdateCategory = () => {
        if (methods?.watch("category_name") === "") {
            toast.error("Please enter category name.");
            return;
        }

        if (methods?.watch("categories")?.filter(c => c?.term_id !== methods?.watch("category_id"))?.find((c) => c?.name?.toLowerCase() === methods?.watch("category_name")?.toLowerCase())) {
            toast.error("Category name is already exist.");
            return;
        }

        if (methods?.watch("category_id") === null) {
            toast.error("Please select category.");
            return;
        }

        updateCategoryMutation?.mutate({
            category_name: methods?.watch("category_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("category_name", "");
                methods.setValue("category_id", null);
                methods?.setValue("categories", data?.data?.categories);
                toast.success("Category updated successfully.");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
                console.error(error);
            }
        })
    }

    const handleDeleteCategory = () => {
        if (methods?.watch("category_id") === null) {
            toast.error("Please select category.");
            return;
        }

        if (confirm("Do you really want to delete this category?")) {
            deleteCategoryMutation?.mutate({}, {
                onSuccess: (data) => {
                    methods.setValue("category_name", "");
                    methods.setValue("category_id", null);
                    methods?.setValue("categories", data?.data?.categories);
                    toast.success("Category deleted successfully.");
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message);
                    console.error(error);
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
                <Typography variant="h6">Quiz Categories</Typography>
                <Divider />
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12} lg={7}>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                }}
                            >
                                Select Category
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
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
                                    `${option?.name} ${option?.default ? "(Default)" : ""}` || ""
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
                                        label="Select Category"
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
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                }}
                            >
                                {methods?.watch("category_id") === null
                                    ? "Add Category"
                                    : methods?.watch("categories")?.find(
                                        (c) => c?.term_id === methods?.watch("category_id")
                                    )?.default
                                        ? "Edit Category"
                                        : "Edit/Delete Category"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Box sx={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <CustomTextField
                                    fullWidth
                                    name="category_name"
                                    size="small"
                                    label="Enter category name *"
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
                                            <LoadingButton
                                                loading={addCategoryMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddCategory}
                                            >Add</LoadingButton>
                                        )
                                        :
                                        <>
                                            <LoadingButton
                                                loading={updateCategoryMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleUpdateCategory}
                                            >Update</LoadingButton>
                                            {!methods?.watch("categories")?.find(
                                                (c) => c?.term_id === methods?.watch("category_id")
                                            )?.default && (
                                                    <LoadingButton
                                                        loading={deleteCategoryMutation?.isPending}
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleDeleteCategory}
                                                    >Delete</LoadingButton>)
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
            toast.error("Please enter language name.");
            return;
        }

        if (methods?.watch("languages")?.find((c) => c?.name?.toLowerCase() === methods?.watch("language_name")?.toLowerCase())) {
            toast.error("Language name is already exist.");
            return;
        }

        addLanguageMutation?.mutate({
            language_name: methods?.watch("language_name")
        }, {
            onSuccess: (data) => {
                methods?.setValue("language_name", "");
                methods?.setValue("languages", data?.data?.languages);
                toast.success("Langauge added successfully.");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
                console.log(error);
            }
        })
    }

    const handleUpdateLanguage = () => {
        if (methods?.watch("language_name") === "") {
            toast.error("Please enter language name.");
            return;
        }

        if (methods?.watch("languages")?.filter(l => l?.term_id !== methods?.watch("language_id"))?.find((l) => l?.name?.toLowerCase() === methods?.watch("language_name")?.toLowerCase())) {
            toast.error("Language name is already exist.");
            return;
        }

        if (methods?.watch("language_id") === null) {
            toast.error("Please select language.");
            return;
        }

        updateLanguageMutation?.mutate({
            language_name: methods?.watch("language_name"),
        }, {
            onSuccess: (data) => {
                methods.setValue("language_name", "");
                methods.setValue("language_id", null);
                methods?.setValue("languages", data?.data?.languages);
                toast.success("Language updated successfully.");
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
                console.error(error);
            }
        })
    }

    const handleDefaultLanguage = () => {
        if (methods?.watch("language_id") === null) {
            toast.error("Please select language.");
            return;
        }

        if (confirm("Are you sure you want to switch the default language?")) {
            setDefaultLanguageMutation?.mutate({}, {
                onSuccess: (data) => {
                    methods.setValue("language_name", "");
                    methods.setValue("language_id", null);
                    methods?.setValue("languages", data?.data?.languages);
                    toast.success("Language set to default.");
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message);
                    console.error(error);
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
                <Typography variant="h6">Quiz Languages</Typography>
                <Divider />
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12} lg={7}>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                }}
                            >
                                Select Language
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
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
                                    `${option?.name} ${option?.default ? "(Default)" : ""}` || ""
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
                                        label="Select Language"
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
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                }}
                            >
                                {methods?.watch("language_id") === null
                                    ? "Add Language"
                                    : "Edit Language"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Box sx={{
                                display: "flex",
                                gap: 2,
                            }}>
                                <CustomTextField
                                    fullWidth
                                    name="language_name"
                                    size="small"
                                    label="Enter language name *"
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
                                            <LoadingButton
                                                loading={addLanguageMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddLanguage}
                                            >Add</LoadingButton>
                                        )
                                        :
                                        <>
                                            <LoadingButton
                                                loading={updateLanguageMutation?.isPending}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleUpdateLanguage}
                                            >Update</LoadingButton>
                                            {
                                                !methods?.watch("languages")?.find(l => l?.term_id === methods?.watch("language_id"))?.default &&
                                                <LoadingButton
                                                    loading={setDefaultLanguageMutation?.isPending}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleDefaultLanguage}
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        minWidth: "90px",
                                                    }}
                                                >Set Default</LoadingButton>
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
