import {
    Autocomplete,
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import React, { memo, useState } from "react";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
import { IoClose } from "../../../../helpers/icons";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import CustomTypography from "../../../../components/CustomTypography";
import { DeleteLanguageFromQuiz, UpdateAddLanguageToQuiz, UpdateSetDefaultLanguageToQuiz } from "../../../../requests/admin/AdminQuizRequest";

const LanguageSection = (props) => {
    const methods = useForm({
        defaultValues: {
            show_modal: false,
            language_id: null,
        },
    });
    const language_options = props?.languages?.filter((val) =>
        !props?.watch("languages")?.includes(val?.term_id)
    );

    const addLanguage = UpdateAddLanguageToQuiz(props?.watch("id"));
    const setDefaultLanguage = UpdateSetDefaultLanguageToQuiz(props?.watch("id"));
    const deleteLanguage = DeleteLanguageFromQuiz(props?.watch("id"));

    const handleSaveLanaguage = (copy_default_language = false) => {
        const currentLanguageId = methods?.watch("language_id");
        const languageData = props?.watch("meta.language_data") || [];
        const defaultLanguageId = props?.watch("meta.default_language_id");
        const languages = props?.watch("languages") || [];

        // Save current state for rollback
        const previousState = {
            defaultLanguageId,
            languageData: [...languageData],
            languages: [...languages],
        };
        // Check and add default langauge
        if (!defaultLanguageId && languages?.length === 0) {
            props?.setValue("meta.default_language_id", currentLanguageId, { shouldDirty: true });
            // Set quiz language data to default language
            props?.setValue("meta.language_data.0.language_id", currentLanguageId, { shouldDirty: true });
        } else {
            let newLangData = {
                language_id: currentLanguageId,
                default: false,
                selected: false,
                instruction1: "",
                instruction2: "",
                term_and_condition_text: "",
                term_and_condition_warning_text: "",
            }

            if (copy_default_language) {
                // Copy default langauge
                const defaultLangData = languageData?.find(l => l?.default);
                newLangData = {
                    ...defaultLangData,
                    language_id: currentLanguageId,
                    default: false,
                    selected: false,
                };
            }

            props?.setValue("meta.language_data",
                [
                    ...languageData,
                    newLangData
                ], { shouldDirty: true });
        }

        // Add language
        props?.setValue("languages", [...languages, currentLanguageId], {
            shouldDirty: true,
        });

        if (!props?.create) {
            // add langauge to questions
            const data = {
                copy_default_language: copy_default_language,
                languages: props?.watch("languages"),
                language_id: currentLanguageId,
                meta: {
                    multi_language: props?.watch("meta.multi_language"),
                    default_language_id: props?.watch("meta.default_language_id"),
                    language_data: props?.watch("meta.language_data")
                }
            };

            addLanguage?.mutate(data, {
                onSuccess: (data) => {
                    toast.success("Language added successfully.");
                },
                onError: (data) => {
                    console.error(data?.data);
                    toast.error("Something went wrong.");
                    props?.setValue("meta.default_language_id", previousState.defaultLanguageId, { shouldDirty: true });
                    props?.setValue("meta.language_data", previousState.languageData, { shouldDirty: true });
                    props?.setValue("languages", previousState.languages, { shouldDirty: true });
                }
            })
        }

        methods?.setValue("language_id", null);
    }

    const handleAddLanguage = () => {
        if (!methods?.watch("language_id")) {
            toast.error("Please select language");
            return;
        }

        if (props?.watch("languages")?.length > 0) {
            methods?.setValue("show_modal", true);
            return;
        }
        handleSaveLanaguage(false);
    };

    const handleSetDefaultLanguage = (language_id) => {
        if (!language_id) {
            toast.error("Please select language");
            return;
        }

        if (confirm("Are you sure you want to set this as the default language? This will update all associated data, including questions, instructions, and other content, to use this language as the default.")) {
            const data = {
                language_id: language_id,
                meta: {
                    default_language_id: language_id,
                    language_data: props?.watch("meta.language_data")?.map(l => {
                        if (l?.language_id === language_id) {
                            l.default = true;
                            l.selected = true;
                        } else {
                            l.default = false;
                            l.selected = false;
                        }
                        return l;
                    })
                }
            };

            if (props?.create) {
                props?.setValue("meta.default_language_id", data?.meta?.default_language_id, { shouldDirty: true });
                props?.setValue(
                    "meta.language_data",
                    data?.meta?.language_data
                    , { shouldDirty: true });
            }

            if (!props?.create) {
                // update default langauge

                setDefaultLanguage?.mutate(data, {
                    onSuccess: (_) => {
                        console.log(data);
                        toast.success("Default language updated successfully.");
                        props?.setValue("meta.default_language_id", data?.meta?.default_language_id, { shouldDirty: true });
                        props?.setValue(
                            "meta.language_data",
                            data?.meta?.language_data
                            , { shouldDirty: true });
                    },
                    onError: (data) => {
                        console.error(data?.data);
                        toast.error("Something went wrong.");
                    }
                })
            }
        }
    }

    const handleRemoveLanguage = (language_id) => {
        if (!language_id) {
            toast.error("Please select language");
            return;
        }

        if (confirm("Are you sure you want to delete this language? This action will permanently remove all associated data, including questions, instructions, and other content in this language. Data in other languages will remain unaffected.")) {
            const data = {
                languages: props?.watch("languages").filter(l => l !== language_id),
                language_id: language_id,
                meta: {
                    language_data: props?.watch("meta.language_data")?.filter(l => l?.language_id !== language_id)
                }
            };
            if (props?.create) {
                props?.setValue("languages", data?.languages);
                props?.setValue("meta.language_data", data?.meta?.language_data, { shouldDirty: true });
            }

            if (!props?.create) {
                // update default langauge
                deleteLanguage?.mutate(data, {
                    onSuccess: () => {
                        toast.success("Language removed successfully.");
                        props?.setValue("languages", data?.languages);
                        props?.setValue("meta.language_data", data?.meta?.language_data, { shouldDirty: true });
                    },
                    onError: (data) => {
                        console.error(data?.data);
                        toast.error("Something went wrong.");
                    }
                })
            }
        }
    }

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1),
        },
        "& .MuiPaper-root": {
            width: "100%",
        },
    }));

    const handleClose = () => {
        methods?.setValue("show_modal", false);
    }

    return (
        <Grid item xs={12} sm={12}>
            <Card>
                <CardContent>
                    <Box sx={{ color: "black" }}>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={deleteLanguage?.isPending || setDefaultLanguage?.isPending || addLanguage?.isPending}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <BootstrapDialog
                            open={methods?.watch("show_modal")}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <CopyLanguageModel
                                {...methods}
                                handleClose={handleClose}
                                handleSaveLanaguage={handleSaveLanaguage}
                            />
                        </BootstrapDialog>
                        <Box
                            sx={{
                                marginY: 2,
                            }}
                        >
                            <Typography variant="h6">Language Options</Typography>
                            <Divider />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} lg={6}>
                                <Grid container spacing={3}>
                                    <GridItem1 xs={12} sm={6} lg={6}>
                                        <CustomTypography>Multi Language</CustomTypography>
                                    </GridItem1>
                                    <GridItem1 xs={12} sm={6} lg={6}>
                                        <FormControlLabel
                                            control={
                                                <CustomSwitch />
                                            }
                                            checked={props.watch("meta.multi_language")}
                                            onChange={(e) => {
                                                props?.setValue("meta.multi_language", e?.target?.checked, {
                                                    shouldDirty: true,
                                                });
                                            }}
                                            label="Activate"
                                        />
                                    </GridItem1>

                                    <GridItem1 xs={12} sm={6} lg={6} sx={{
                                        display: props?.watch("meta.multi_language") ? "flex" : "none",
                                    }}>
                                        <CustomTypography>Select language</CustomTypography>
                                    </GridItem1>
                                    <GridItem1
                                        xs={12}
                                        sm={6}
                                        lg={6}
                                        sx={{
                                            display: props?.watch("meta.multi_language") ? "flex" : "none",
                                            gap: 2
                                        }}
                                    >
                                        <Autocomplete
                                            size="small"
                                            fullWidth
                                            value={
                                                methods?.watch("language_id") !== null
                                                    ? language_options?.find((val) =>
                                                        val?.term_id === methods?.watch("language_id")
                                                    )
                                                    : null
                                            }
                                            options={language_options?.length > 0 ? language_options : []}
                                            getOptionLabel={(option) => option?.name || ""}
                                            isOptionEqualToValue={(option, value) => option?.term_id === value?.term_id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Select Languages"
                                                />
                                            )}
                                            onChange={(_, newValue) => {
                                                if (!newValue) {
                                                    methods?.setValue("language_id", null);
                                                    return;
                                                }
                                                methods?.setValue("language_id", newValue?.term_id);
                                            }}
                                        />
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={handleAddLanguage}
                                        >
                                            Add
                                        </LoadingButton>
                                    </GridItem1>
                                    <GridItem1
                                        xs={12}
                                        sm={12}
                                        lg={12}
                                    >
                                        <List >
                                            {props?.watch("languages").map((value, index) => (
                                                <ListItem
                                                    key={index}
                                                    disableGutters
                                                    secondaryAction={
                                                        <React.Fragment>
                                                            {
                                                                props?.watch("meta.default_language_id") !== value &&
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    gap: 1
                                                                }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        size="small"
                                                                        onClick={handleSetDefaultLanguage.bind(this, value)}
                                                                    >
                                                                        Set Default
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={handleRemoveLanguage.bind(this, value)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Box>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={props?.languages?.find(l => l?.term_id === value)?.name}
                                                        secondary={props?.watch("meta.default_language_id") === value ? "Default" : ""}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </GridItem1>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                </CardContent>
            </Card>
        </Grid>
    );
};

const CopyLanguageModel = memo((props) => {
    const [copyDefaultLanguage, setCopyDefaultLanguage] = useState(false);
    return (
        <>
            <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
                Would like to copy data
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={props?.handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <IoClose />
            </IconButton>
            <DialogContent>
                <Grid container gap={4}>
                    <Grid item xs={12} lg={12}>
                        <FormControlLabel
                            control={
                                <CustomSwitch
                                    checked={copyDefaultLanguage}
                                    onChange={(e) => {
                                        console.log(e?.target?.checked);
                                        setCopyDefaultLanguage(e?.target?.checked);
                                    }}
                                />
                            }
                            label="Would you like to copy the default language's data, such as instructions, questions, and other relevant content, to the newly created language?"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={props?.handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={() => {
                        props?.handleClose();
                        props?.handleSaveLanaguage(copyDefaultLanguage);
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </>
    )
})

export default LanguageSection;
